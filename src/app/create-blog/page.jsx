"use client"

import { CldUploadWidget } from "next-cloudinary"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PenLine, ImagePlus, X, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs";



export default function CreateBlog() {
  const { userId } = useAuth();
  const { user } = useUser();
  const author = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const [imageUrl, setImageUrl] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset body overflow when component unmounts or when upload state changes
  useEffect(() => {
    // Ensure body scroll is enabled
    document.body.style.overflow = "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isUploading])


  // Function To Send Data To Backend
  const sendData = async () => {
    try {
      setIsSubmitting(true)

      const response = await fetch("/api/save-blog-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author,
          title,
          content,
          userId,
          status: "published",
          imageUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to save blog")
      }

      // Success handling with toast and View Post link
      toast.success("Blog post created successfully!", {
        description: (
          <div>
            Your blog has been published.{" "}
            <a
              href={`/blog/${result.blog._id}`}
              className="underline font-medium hover:text-primary"
              onClick={(e) => {
                // Prevent the toast from closing when clicking the link
                e.stopPropagation()
              }}
            >
              View Post
            </a>
          </div>
        ),
        duration: 5000,
      })

      console.log(result)
      // Optional: Reset form after successful submission
      resetForm()
    } catch (error) {
      console.error("Error saving blog:", error)

      // Error handling with toast
      toast.error("Failed to create blog post", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setImageUrl("")
    console.log(userId)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!title.trim()) {
      return toast.error("Title is required")
    }

    if (!content.trim()) {
      return toast.error("Content is required")
    }

    if (!imageUrl) {
      return toast.error("Please upload an image for your blog")
    }

    sendData()
  }

  const handleUploadStart = () => {
    setIsUploading(true)
  }

  const handleUploadSuccess = (result) => {
    console.log("Image uploaded successfully!", result)
    setImageUrl(result.info.secure_url)
    setIsUploading(false)

    // Show success toast for image upload
    toast.success("Image uploaded successfully")

    // Force enable scrolling after upload completes
    setTimeout(() => {
      document.body.style.overflow = "auto"
      window.scrollTo(window.scrollX, window.scrollY + 1)
      window.scrollTo(window.scrollX, window.scrollY - 1)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Create Your Story
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, ideas, and experiences with the world through your beautifully crafted blog post.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Featured Image Section */}
          <div className="bg-card rounded-xl shadow-sm p-8 border border-border/50">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <ImagePlus className="h-5 w-5 text-primary" />
              Featured Image
            </h2>

            {!imageUrl ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <CldUploadWidget
                  uploadPreset="blog_upload_preset"
                  onSuccess={handleUploadSuccess}
                  onOpen={handleUploadStart}
                  onError={(error) => toast.error("Upload failed", { description: error.message })}
                  options={{
                    clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                    maxFileSize: 10000000, // 10MB
                  }}
                >
                  {({ open }) => (
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => open()}>
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg font-medium mb-1">
                        {isUploading ? "Uploading..." : "Upload your cover image"}
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Drag and drop or click to browse. Supports JPG, PNG and GIF up to 10MB.
                      </p>
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black/5">
                <img src={imageUrl || "/placeholder.svg"} alt="Blog cover" className="w-full h-[300px] object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full opacity-90 hover:opacity-100"
                  onClick={() => {
                    setImageUrl("")
                    toast.info("Image removed")
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            )}
          </div>

          {/* Title Section */}
          <div className="bg-card rounded-xl shadow-sm p-8 border border-border/50">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <PenLine className="h-5 w-5 text-primary" />
              Blog Details
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                  Title
                </label>
                <input
                  id="title"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
                  type="text"
                  placeholder="Enter a captivating title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[400px] text-base leading-relaxed"
                  placeholder="Write your blog content here... Tell your story with passion!"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Pro tip: Use clear paragraphs and engaging language to keep your readers interested.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Your Story"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

