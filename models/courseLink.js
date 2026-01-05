import mongoose from "mongoose";

const courseLinkSchema = new mongoose.Schema(
  {
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    title: { type: String },
    description: { type: String },
    certificate: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CourseLink || mongoose.model("CourseLink", courseLinkSchema);
