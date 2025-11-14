import mongoose from "mongoose";

const countersSchema = new mongoose.Schema(
  {
    comments: { type: Number, default: 0 },
    reactions: { type: Number, default: 0 },
    reports: { type: Number, default: 0 }
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorRole: {
      type: String,
      enum: ["student", "professor", "company", "admin"],
      required: true
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    visibility: {
      type: String,
      enum: ["student", "professor", "company"],
      required: true
    },
    imageUrl: { type: String,trim: true ,required: false, default: null },
    linkUrl: { type: String, default: null },
    counters: { type: countersSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
