import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Badge name is required"],
      trim: true,
    },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "diamond"],
      default: "bronze",
    },
    type: {
      type: String,
      enum: ["achievement", "project", "certificate", "skill", "composite"],
      required: true,
      default: "achievement",
    },
    criteria: {
      minAchievements: { type: Number, default: 0 },
      minProjects: { type: Number, default: 0 },
      minCertificates: { type: Number, default: 0 },
      minSkills: { type: Number, default: 0 },
    },
    awardedBy: {
      type: String,
      enum: ["system", "admin"],
      default: "system",
    },
    awardedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);
