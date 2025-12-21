import mongoose from "mongoose";

const competencyEvaluationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    competencies: {
      practicalCompetency: { type: Number, min: 0, max: 10, required: true },
      problemSolving: { type: Number, min: 0, max: 10, required: true },
      analyticalThinking: { type: Number, min: 0, max: 10, required: true },
      communicationDocumentation: { type: Number, min: 0, max: 10, required: true },
    },
    overallComment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    totalScore: {
      type: Number,
    },
  },
  { timestamps: true }
);

competencyEvaluationSchema.pre("save", function (next) {
  const c = this.competencies;
  this.totalScore =
    c.practicalCompetency +
    c.problemSolving +
    c.analyticalThinking +
    c.communicationDocumentation;
  next();
});

export default mongoose.model(
  "CompetencyEvaluation",
  competencyEvaluationSchema
);