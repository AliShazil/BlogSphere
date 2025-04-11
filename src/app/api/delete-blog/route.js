import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";

export async function DELETE(request) {
    try {
        await connectToDatabase(); // Ensure database connection
        const { searchParams } = new URL(request.url); // Extract query params
        const blogId = searchParams.get("blogId"); // Get blogId from query params

        if (!blogId) {
            return Response.json({
                success: false,
                message: "Blog ID is required"
            }, { status: 400 });
        }

        // Delete the blog by ID
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return Response.json({
                success: false,
                message: "Blog not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Blog deleted successfully",
            deletedBlog, // Return deleted blog data
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return Response.json({
            success: false,
            message: "Failed to delete blog",
            error: error.message
        }, { status: 500 });
    }
}
