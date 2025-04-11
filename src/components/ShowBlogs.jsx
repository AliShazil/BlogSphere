"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const ShowBlogs = ({ limit }) => {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/get-blogs?limit=${limit}`)
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch blogs")
      }
      setBlogs(result.blogs)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [limit])

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center sm:text-left mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
          {limit ? "Recent Blogs" : "All Blogs"}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto sm:mx-0">
          {limit
            ? "Check out our latest articles and stay updated with the newest trends and insights."
            : "Browse through our complete collection of articles covering various topics and interests."}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No blogs found</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back later for new content</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] 
                                     border rounded-lg shadow-md overflow-hidden transition-all 
                                     duration-300 hover:shadow-xl hover:-translate-y-1 bg-card"
            >
              <div className="w-full h-48 sm:h-56 md:h-64 relative">
                <Image
                  src={blog.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={blogs.indexOf(blog) < 3}
                />
              </div>
              <div className="p-4 sm:p-5 lg:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 text-card-foreground">{blog.title}</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                  {blog.content.length > 100 ? `${blog.content.slice(0, 100)}...` : blog.content}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/blog/${blog._id}`}
                    className="text-primary font-medium inline-flex items-center hover:underline"
                  >
                    Read More <span className="ml-1">→</span>
                  </Link>
                  {blog.date && (
                    <span className="text-xs text-muted-foreground">{new Date(blog.date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {limit && blogs.length > 0 && (
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/blogs"
          >
            <Button className="rounded-full text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 cursor-pointer" >View All Blogs</Button>
          </Link>
        </div>
      )}
    </section>
  )
}

export default ShowBlogs

