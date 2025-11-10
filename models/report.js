import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetType: {
      type: String,
      enum: ["post", "comment", "question"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reason: {
      type: String,
      trim: true,
      default: "Inappropriate content"
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "action_taken"],
      default: "pending"
    },
    adminNote: { type: String, trim: true, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

reportSchema.index({ targetId: 1, targetType: 1 });
reportSchema.index({ reporterId: 1 });

reportSchema.index({ reporterId: 1, targetId: 1, targetType: 1 }, { unique: true });
export default mongoose.model("Report", reportSchema);