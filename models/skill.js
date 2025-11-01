import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    description: { type: String, trim: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    linkedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    linkedAchievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
    linkedCertificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourseLink" }],
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
