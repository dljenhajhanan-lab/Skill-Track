import mongoose from "mongoose";

const countersSchema = new mongoose.Schema(
  {
    comments: { type: Number, default: 0 },
    reports: { type: Number, default: 0 }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    authorRole: {
      type: String,
      enum: ["student", "professor", "company", "admin"],
      required: true
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    isSolved: { type: Boolean, default: false },
    solutionCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },
    counters: { type: countersSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);
questionSchema.index({ createdAt: -1 });
questionSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true
});

export default mongoose.model("Question", questionSchema);
