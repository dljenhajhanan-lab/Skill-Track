import mongoose from "mongoose";

const countersSchema = new mongoose.Schema(
  {
    reactions: { type: Number, default: 0 },
    replies: { type: Number, default: 0 }
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    content: { type: String, required: true, trim: true },
    counters: { type: countersSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: 1 });

export default mongoose.model("Comment", commentSchema);
