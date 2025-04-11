import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";

export async function GET(request) {
    try {
        await connectToDatabase(); // Ensure database connection
        const { searchParams } = new URL(request.url); // Extract query params
        const userId = searchParams.get("userId"); // Get userId from query params

        if (!userId) {
            return Response.json({
                success: false,
                message: "User ID is required"
            }, { status: 400 });
        }

        // Fetch blogs based on userId
        const blogs = await Blog.find({ userId }).sort({ createdAt: -1 });

        return Response.json({
            success: true,
            message: "Fetched user blogs successfully",
            blogs, // Return blogs
        }, { status: 200 });

    } catch (error) {
        console.error("Error Fetching blogs:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message
        }, { status: 500 });
    }
}
