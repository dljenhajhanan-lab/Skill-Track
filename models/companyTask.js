import mongoose from "mongoose";

const companyTaskSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    basePoints: { type: Number, default: 100 },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    language: { type: String, default: "javascript" }, 
    referenceSolution: { type: String, required: true },
    testCases: { type: [Object], default: [] },

    maxAttempts: { type: Number, default: 3 },
    aiEnabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CompanyTask = mongoose.model("CompanyTask", companyTaskSchema);