import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    targetType: { type: String, enum: ["post", "comment"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind: {
      type: String,
      enum: ["wise", "loved", "support", "applause", "like", "opps"],
      required: true
    }
  },
  { timestamps: true }
);

reactionSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
