"use client";
import ShowBlogs from "@/components/ShowBlogs";

export default function BlogPage() {
  return (
    <section className="container mx-auto px-4 sm:px-2 py-10 sm:py-16 md:pt-30">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold capitalize leading-tight">
          Explore Inspiring Stories & Insights
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-4">
          Discover thought-provoking blogs, expert insights, and engaging content curated just for you. Stay informed, get inspired, and fuel your passion for knowledge.
        </p>
      </div>
      
      <div className="mt-8 sm:mt-10">
        <ShowBlogs />
      </div>
    </section>
  );
}