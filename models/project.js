import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: [true, "Project title is required"], trim: true },
    description: { type: String, trim: true },
    technologies: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    github: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
