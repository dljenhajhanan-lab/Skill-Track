import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["post", "comment"], required: true },
    type: {
      type: String,
      enum: ["wise", "loved", "support", "applause", "like", "opps"],
      required: true
    }
  },
  { timestamps: true }
);

reactionSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
export default mongoose.model("Reaction", reactionSchema);