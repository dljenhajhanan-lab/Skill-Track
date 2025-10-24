import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    name: { type: String, required: [true, "Badge name is required"], trim: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    awardedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);
