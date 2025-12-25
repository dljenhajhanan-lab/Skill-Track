import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    targetType: {
      type: String,
      enum: ["post", "question"],
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    source: {
      type: String,
      default: "openrouter"
    }
  },
  { timestamps: true }
);

tagSchema.index({ targetType: 1, targetId: 1 });
tagSchema.index({ tags: 1 });

export default mongoose.model("Tag", tagSchema);
