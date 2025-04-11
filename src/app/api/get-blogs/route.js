import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";



export async function GET(request) {
    try {
        await connectToDatabase(); // Ensure database connection
        const { searchParams } = new URL(request.url); // Extract query params
        const limit = searchParams.get("limit"); // Get limit from query params

        // Fetch blogs from database with limit
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(limit ? parseInt(limit) : undefined);

        return Response.json({
            success: true,
            message: "Fetched blogs successfully",
            blogs, // Return blogs
        }, { status: 200 });

    } catch (error) {
        console.error("Error Fetching blog:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message
        }, { status: 500 });
    }
}
