import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";

export async function POST(request) {
    try {
        await connectToDatabase(); // Ensure database connection

        const { author, title, content, userId, status, imageUrl } = await request.json();

        // Create and save the blog
        const newBlog = await Blog.create({ author, title, content, userId, status, imageUrl });

        return Response.json({
            success: true,
            message: "Blog info inserted successfully to database",
            blog: newBlog
        }, { status: 201 });

    } catch (error) {
        console.error("Error inserting blog:", error);
        return Response.json({
            success: false,
            message: "Failed to insert blog",
            error: error.message
        }, { status: 500 });
    }
}
