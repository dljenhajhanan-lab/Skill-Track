import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: String,
    name: String,
    mime: String,
    size: Number
  },
  { _id: false }
);

const countersSchema = new mongoose.Schema(
  {
    comments: { type: Number, default: 0 },
    reactions: { type: Number, default: 0 }
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["post", "question", "task"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
    file: { type: fileSchema, default: null },
    visibility: {
      scope: { type: String, enum: ["public", "followers_only"], default: "public" }
    },
    checkedCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    counters: { type: countersSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
