import mongoose from "mongoose";

const courseLinkSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: [true, "Course title is required"], trim: true },
    //platform: { type: String, trim: true },
    link: { type: String, trim: true },
    certificate: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("CourseLink", courseLinkSchema);
