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
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      enum: ["post", "question"],
      required: true
    },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    content: { type: String, required: true, trim: true },
    acceptedBy: {
      author: { type: Boolean, default: false },
      professor: { type: Boolean, default: false }
    },
    counters: { type: countersSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

commentSchema.index({ targetId: 1, targetType: 1, parentCommentId: 1, createdAt: 1 });
export default mongoose.model("Comment", commentSchema);
