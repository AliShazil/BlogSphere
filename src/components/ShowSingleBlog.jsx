"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ShareIcon, BookmarkIcon, HeartIcon, MessageSquareIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ShowSingleBlog = ({ blogId }) => {
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const fetchBlog = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/get-single-blog?id=${blogId}`)
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch blog")
      }
      setBlog(result.blog)
    } catch (error) {
      console.error("Error fetching blog:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlog()
  }, [blogId])

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Estimate read time (1 min per 200 words)
  const calculateReadTime = (content) => {
    if (!content) return "1 min read"
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full mb-6 rounded-xl" />
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Unable to load blog</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!blog) return null

  const readTime = blog.readTime || calculateReadTime(blog.content)

  return (
    <div className="bg-background min-h-screen">
      {/* Floating action buttons */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${liked ? "text-red-500 bg-red-50" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          <HeartIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MessageSquareIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ShareIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${bookmarked ? "text-primary bg-primary/10" : ""}`}
          onClick={() => setBookmarked(!bookmarked)}
        >
          <BookmarkIcon className="h-5 w-5" />
        </Button>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in">
            {blog.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={blog.authorImage || "/placeholder.svg?height=40&width=40"} />
              <AvatarFallback>{blog.author ? blog.author.substring(0, 2).toUpperCase() : "AU"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{blog.author || "Anonymous"}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDate(blog.createdAt || new Date())}</span>
                <span>•</span>
                <span>{readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={blog.imageUrl || "/placeholder.svg?height=800&width=1200"}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Mobile action buttons */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full ${liked ? "text-red-500" : ""}`}
              onClick={() => setLiked(!liked)}
            >
              <HeartIcon className="h-4 w-4 mr-1" />
              <span>{liked ? "Liked" : "Like"}</span>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <MessageSquareIcon className="h-4 w-4 mr-1" />
              <span>Comment</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <ShareIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full h-8 w-8 ${bookmarked ? "text-primary" : ""}`}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {blog.content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="mb-6 leading-relaxed">
                {paragraph}
              </p>
            ) : null,
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author bio */}
        {blog.author && (
          <div className="mt-12 pt-6 border-t">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={blog.authorImage || "/placeholder.svg?height=64&width=64"} />
                <AvatarFallback>{blog.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">Written by {blog.author}</h3>
                <p className="text-muted-foreground mt-1 mb-3">
                  {blog.authorBio || "Content creator and blogger passionate about sharing knowledge and insights."}
                </p>
                <Button variant="outline" size="sm" className="rounded-full">
                  Follow
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Related posts placeholder */}
        <div className="mt-12 pt-6 border-t">
          <h3 className="text-2xl font-semibold mb-6">More like this</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-muted relative">
                <Image src="/placeholder.svg?height=160&width=320" alt="Related post" fill className="object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-medium line-clamp-2 mb-1">Another interesting blog post you might enjoy reading</h4>
                <p className="text-sm text-muted-foreground">March 15, 2025 • 4 min read</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-muted relative">
                <Image src="/placeholder.svg?height=160&width=320" alt="Related post" fill className="object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-medium line-clamp-2 mb-1">Discover more insights about this topic in our guide</h4>
                <p className="text-sm text-muted-foreground">March 10, 2025 • 6 min read</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default ShowSingleBlog

