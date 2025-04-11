import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";



export async function GET(request) {
    try {
        await connectToDatabase(); // Ensure database connection
        const { searchParams } = new URL(request.url); // Extract query params
        const blogId = searchParams.get("id"); // Get limit from query params

        // Fetch blogs from database with limit
        const blog = await Blog.findOne({ _id: blogId });

        return Response.json({
            success: true,
            message: "Fetched blogs successfully",
            blog, // Return blogs
        }, { status: 200 });

    } catch (error) {
        console.error("Error Fetching single blog:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch single blog",
            error: error.message
        }, { status: 500 });
    }
}
