import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["RESET_PASSWORD"],
      default: "RESET_PASSWORD",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

otpTokenSchema.index({ userId: 1, purpose: 1, expiresAt: 1 });

export default mongoose.model("OtpToken", otpTokenSchema);
