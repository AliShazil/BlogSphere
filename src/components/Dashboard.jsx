"use client"
import Link from "next/link"
import Image from "next/image"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PenLine, Eye, Edit, Trash2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Dashboard() {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [blogToDelete, setBlogToDelete] = useState(null)
  const { userId } = useAuth()

  // Calculate read time based on content length (average reading speed: 200 words per minute)
  const calculateReadTime = (content) => {
    const words = content.trim().split(/\s+/).length
    const readTimeMinutes = Math.ceil(words / 200)
    return `${readTimeMinutes} min read`
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchBlogs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/get-user-blogs?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch blogs")
      }

      setBlogs(result.blogs)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return

    try {
      const response = await fetch(`/api/delete-blog/?blogId=${blogToDelete}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete blog")
      }

      // Refresh blogs after deletion
      fetchBlogs()
    } catch (error) {
      console.error("Error deleting blog:", error)
    } finally {
      setBlogToDelete(null)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchBlogs()
    }
  }, [userId])

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your blogs and create new content</p>
          </div>
          <Link href="/create-blog">
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
              <PenLine className="h-4 w-4" />
              Create New Blog
            </Button>
          </Link>
        </div>

        {/* Blog Stats */}
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-3 md:grid-cols-3 px-4 sm:px-0">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{blogs.length}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {blogs.filter((blog) => blog.status === "published").length}
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {blogs.filter((blog) => blog.status === "draft").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 sm:py-12 mx-4 sm:mx-0">
            <div
              className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Loading your blogs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8 sm:py-12 border rounded-lg bg-destructive/10 mx-4 sm:mx-0">
            <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive mx-auto mb-2" />
            <h3 className="text-base sm:text-lg font-medium mb-2">Failed to load blogs</h3>
            <p className="text-sm text-muted-foreground mb-4 px-4">{error}</p>
            <Button size="sm" className="sm:size-default" onClick={fetchBlogs}>
              Try Again
            </Button>
          </div>
        )}

        {/* Your Blogs Section */}
        {!isLoading && !error && blogs.length > 0 && (
          <div className="px-4 sm:px-0">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Blogs</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden flex flex-col h-full">
                  <div className="relative w-full h-32 sm:h-40">
                    <Image
                      src={blog.imageUrl || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base sm:text-lg font-semibold line-clamp-1">{blog.title}</CardTitle>
                      <div className="flex-shrink-0">
                        {blog.status === "draft" ? (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full whitespace-nowrap">
                            Draft
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full whitespace-nowrap">
                            Published
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2 text-xs mt-1">
                      <span>{formatDate(blog.createdAt)}</span>
                      <span>•</span>
                      <span>{calculateReadTime(blog.content)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 sm:pb-4 flex-grow">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{blog.content}</p>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 px-3 sm:px-4 py-2 sm:py-3 mt-auto">
                    <div className="flex justify-between w-full">
                      <Link href={`/blog/${blog._id}`}>
                        <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2 sm:px-3 gap-1">
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs sm:whitespace-nowrap">View</span>
                        </Button>
                      </Link>
                      {/* <Link href={`/edit-blog/${blog._id}`}>
                        <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2 sm:px-3 gap-1">
                          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="sr-only sm:not-sr-only sm:text-xs sm:whitespace-nowrap">Edit</span>
                        </Button>
                      </Link> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 gap-1 text-destructive hover:text-destructive"
                        onClick={() => setBlogToDelete(blog._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="sr-only sm:not-sr-only sm:text-xs sm:whitespace-nowrap">Delete</span>
                      </Button>
                    </div> 
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (shown when no blogs exist) */}
        {!isLoading && !error && blogs.length === 0 && (
          <div className="text-center py-8 sm:py-12 border rounded-lg bg-muted/20 mx-4 sm:mx-0">
            <h3 className="text-base sm:text-lg font-medium mb-2">No blogs yet</h3>
            <p className="text-sm text-muted-foreground mb-4 px-4">Start creating your first blog post today!</p>
            <Link href="/create-blog">
              <Button size="sm" className="sm:size-default">
                <PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Create Your First Blog
              </Button>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your blog post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBlog}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageContainer>
  )
}

