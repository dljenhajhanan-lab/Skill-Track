import mongoose from "mongoose";

const studentAIEvaluationSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      unique: true,
    },
    position: {
      type: String,
      trim: true,
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    level: {
      type: String,
      enum: ["poor", "average", "good", "excellent"],
      required: true,
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    roleFit: {
      fitScore: Number,
      missingSkills: [String],
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "StudentAIEvaluation",
  studentAIEvaluationSchema
);
