import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId:{ type: String, required: true},
    status:{ type: String, required: true},
    imageUrl: { type: String, required: true }, // Store Cloudinary URL here
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
