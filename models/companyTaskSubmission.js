import mongoose from "mongoose";

const companyTaskSubmissionSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyTask", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attemptNumber: { type: Number, required: true },
    codeAnswer: { type: String, required: true },
    similarityScore: { type: Number, default: 0 },
    aiScore: { type: Number, default: 0 },
    aiFeedback: { type: String },
    aiHint: { type: String },
    languageMatch: { type: Boolean, default: true },
    isCorrect: { type: Boolean, default: false },
    finalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: null },
    usedHints: { type: Boolean, default: false },
    hintsCount: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: null },
    addToPortfolio: { type: Boolean, default: false },
    status: { type: String, enum: ["evaluated", "pending"], default: "evaluated" },
  },
  { timestamps: true }
);

export const CompanyTaskSubmission = mongoose.model("CompanyTaskSubmission", companyTaskSubmissionSchema);