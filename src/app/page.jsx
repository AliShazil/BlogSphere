import Image from "next/image";
import { Button } from "@/components/ui/button";
import ShowBlogs from "@/components/ShowBlogs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-2 py-10 sm:py-16 md:pt-40">
        <div className="flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold capitalize text-center leading-tight">
            Create, collaborate, and scale your blogs and docs.
          </h1>
          <p className="text-center text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
            Effortlessly build blogs, API docs, and product guides with Hashnode, with the flexibility of a headless CMS and more.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 sm:mt-10">
          <Button
            className="rounded-full text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 cursor-pointer"
          >
            <Link href={"/create-blog"}>
              Start Creating
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-full text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 cursor-pointer"
          >
            <Link href={"/blogs"}>
              View Blogs
            </Link>
          </Button>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="container mx-auto px-4 sm:px-2 py-2 sm:py-6 md:py-2">

        <ShowBlogs limit={3} />

      </section>
    </main>
  );
}
