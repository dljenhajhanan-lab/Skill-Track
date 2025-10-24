import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: [true, "Achievement title is required"], trim: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    certificate: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
