import mongoose from "mongoose";

const ProfessorActivitySchema = new mongoose.Schema(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    evaluationsCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("ProfessorActivity", ProfessorActivitySchema);
