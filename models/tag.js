import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    tags: { type: [String], default: [] },
    source: { type: String, default: "openai" }
  },
  { timestamps: true }
);

tagSchema.index({ tags: 1 });
tagSchema.index({ post: 1 });

export default mongoose.model("Tag", tagSchema);
