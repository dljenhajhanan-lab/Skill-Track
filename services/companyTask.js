import { CompanyTask } from "./companyTask.model.js";
import { CompanyTaskSubmission } from "./companyTaskSubmission.model.js";
import User from "../user/user.model.js";
import { AppError } from "../../utils/appError.js";
import axios from "axios";
import Badge from "../../models/badge.js";
import { createItem } from "../../services/profileItems.js";
import Project from "../../models/project.js";

const SIMILARITY_THRESHOLD = 0.8;
const NO_HINT_BONUS_MULTIPLIER = 1.2;
const RANK_MULTIPLIERS = { 1: 1.0, 2: 0.9, 3: 0.8, default: 0.7 };

async function evaluateSolutionWithAI({ studentCode, referenceCode }) {
  const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000/api/eval";
  try {
    const { data } = await axios.post(AI_URL, { studentCode, referenceCode });
    return {
      similarity: data.similarity ?? 0,
      feedback: data.feedback ?? "",
      hint: data.hint ?? "",
    };
  } catch (err) {
    console.error("AI error:", err.message);
    return { similarity: 0, feedback: "The Code Could Not Be Analyzed.", hint: "Review the General Sentence Structure." };
  }
}

export const companyTaskService = {
  async createTask(companyId, body) {
    const company = await User.findById(companyId);
    if (!company || company.role !== "company") throw new AppError("Only Companies Can Create Tasks.", 403);
    return await CompanyTask.create({ ...body, company: companyId });
  },

  async submitSolution(studentId, taskId, body) {
    const { codeAnswer, usedHints = false, hintsCount = 0, addToPortfolio = false } = body;
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") throw new AppError("Only students can solve the tasks.", 403);
    const task = await CompanyTask.findById(taskId);
    if (!task || !task.isActive) throw new AppError("The Task is not Available.", 400);

    const attemptsCount = await CompanyTaskSubmission.countDocuments({ task: taskId, student: studentId });
    if (attemptsCount >= task.maxAttempts) throw new AppError("Your Attempts Have Ended.", 400);

    const attemptNumber = attemptsCount + 1;
    const ai = await evaluateSolutionWithAI({ studentCode: codeAnswer, referenceCode: task.referenceSolution });

    const isCorrect = ai.similarity >= SIMILARITY_THRESHOLD;
    let rank = null, finalPoints = 0;

    if (isCorrect) {
      const solvedBefore = await CompanyTaskSubmission.countDocuments({ task: taskId, isCorrect: true });
      rank = solvedBefore + 1;
      const rankMultiplier = RANK_MULTIPLIERS[rank] ?? RANK_MULTIPLIERS.default;
      const hintMultiplier = usedHints ? 1.0 : NO_HINT_BONUS_MULTIPLIER;
      finalPoints = Math.round(task.basePoints * rankMultiplier * hintMultiplier);
      await User.findByIdAndUpdate(studentId, { $inc: { points: finalPoints } });
    }

    const submission = await CompanyTaskSubmission.create({
      task: taskId, student: studentId, attemptNumber, codeAnswer,
      similarityScore: ai.similarity, isCorrect, finalPoints, rank,
      usedHints, hintsCount, aiFeedback: ai.feedback, status: "evaluated",
    });

    if (addToPortfolio && isCorrect) {
      await createItem(Project, student.profileId, {
        title: task.title,
        description: `Task solution "${task.title}"Successfully.`,
        codeSnippet: codeAnswer,
        tags: task.skills,
      });
    }


    if (isCorrect) {
      const solvedCount = await CompanyTaskSubmission.countDocuments({ student: studentId, isCorrect: true });
      let badgeLevel = null;
      if (solvedCount >= 10) badgeLevel = "diamond";
      else if (solvedCount >= 6) badgeLevel = "gold";
      else if (solvedCount >= 4) badgeLevel = "silver";
      else if (solvedCount >= 2) badgeLevel = "bronze";

      if (badgeLevel) {
        await Badge.findOneAndUpdate(
          { profile: student.profileId, name: "Company Tasks Badge" },
          {
            profile: student.profileId,
            name: "Company Tasks Badge",
            description: `Awarded for solving ${solvedCount} company tasks`,
            level: badgeLevel,
            type: "achievement",
          },
          { upsert: true, new: true }
        );
      }
    }

    return submission;
  },

  async getTasks() { return CompanyTask.find({ isActive: true }).populate("company", "name email"); },
  async getTaskById(id) { return CompanyTask.findById(id).populate("company", "name email"); },
  async getTaskSubmissions(id) {
    return CompanyTaskSubmission.find({ task: id }).populate("student", "name email");
  },
  async getStudentSubmissions(studentId) {
    return CompanyTaskSubmission.find({ student: studentId }).populate("task", "title");
  },
};

async function deleteTask(taskId, companyId) {
  const task = await CompanyTask.findById(taskId);
  if (!task) throw new AppError("The Task Does not Exist.", 404);

  if (task.company.toString() !== companyId.toString()) {
    throw new AppError("You are not Authorized to Delete this Task.", 403);
  }

  await CompanyTaskSubmission.deleteMany({ task: taskId });

  await CompanyTask.findByIdAndDelete(taskId);

  return {
    message: "The Task and all Associated Solutions were Successfully Deleted.",
  };
};

async function getCompanyTasks(companyId) {
  const tasks = await CompanyTask.find({ company: companyId }).sort({ createdAt: -1 });
  return {
    message: "The Company Tasks Were Successfully Brought in",
    data: tasks,
  };
};
