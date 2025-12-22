import { CompanyTask } from "../models/companyTask.js";
import { CompanyTaskSubmission } from "../models/companyTaskSubmission.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";
import axios from "axios";
import Badge from "../models/badge.js";
import { createItem } from "./profileItems.js";
import Project from "../models/project.js";
import { normalizePagination } from "../utils/paginate.js"

const SIMILARITY_THRESHOLD = 0.8;
const NO_HINT_BONUS_MULTIPLIER = 1.2;
const RANK_MULTIPLIERS = { 1: 1.0, 2: 0.9, 3: 0.8, default: 0.7 };

export const evaluateSolutionWithAI = async ({ studentCode, referenceCode }) => {
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
    return {
      similarity: 0,
      feedback: "The code could not be analyzed.",
      hint: "Review the overall logic.",
    };
  }
};

export const createTask = async (companyId, body) => {
  const company = await User.findById(companyId);
  if (!company || company.role !== "company")
    throw new AppError("Only companies can create tasks.", 403);

  const task = await CompanyTask.create({ ...body, company: companyId });

  return {
    message: "Task created successfully",
    data: task,
  };
};

export const submitTaskSolution = async (studentId, taskId, body) => {
  const { codeAnswer, usedHints = false, hintsCount = 0, addToPortfolio = false } = body;

  const student = await User.findById(studentId);
  if (!student || student.role !== "student")
    throw new AppError("Only students can submit solutions.", 403);

  const task = await CompanyTask.findById(taskId);
  if (!task || !task.isActive)
    throw new AppError("Task is not available.", 400);

  const attemptsCount = await CompanyTaskSubmission.countDocuments({
    task: taskId,
    student: studentId,
  });

  if (attemptsCount >= task.maxAttempts)
    throw new AppError("Maximum attempts reached.", 400);

  const attemptNumber = attemptsCount + 1;

  const ai = await evaluateSolutionWithAI({
    studentCode: codeAnswer,
    referenceCode: task.referenceSolution,
  });

  const isCorrect = ai.similarity >= SIMILARITY_THRESHOLD;
  let rank = null;
  let finalPoints = 0;

  if (isCorrect) {
    const solvedBefore = await CompanyTaskSubmission.countDocuments({
      task: taskId,
      isCorrect: true,
    });

    rank = solvedBefore + 1;
    const rankMultiplier = RANK_MULTIPLIERS[rank] ?? RANK_MULTIPLIERS.default;
    const hintMultiplier = usedHints ? 1.0 : NO_HINT_BONUS_MULTIPLIER;

    finalPoints = Math.round(task.basePoints * rankMultiplier * hintMultiplier);

    await User.findByIdAndUpdate(studentId, {
      $inc: { points: finalPoints },
    });
  }

  const submission = await CompanyTaskSubmission.create({
    task: taskId,
    student: studentId,
    attemptNumber,
    codeAnswer,
    similarityScore: ai.similarity,
    isCorrect,
    finalPoints,
    rank,
    usedHints,
    hintsCount,
    aiFeedback: ai.feedback,
    status: "evaluated",
  });

  if (addToPortfolio && isCorrect) {
    await createItem(Project, student.profileId, {
      title: task.title,
      description: `Solved company task "${task.title}"`,
      codeSnippet: codeAnswer,
      tags: task.skills,
    });
  }

  if (isCorrect) {
    const solvedCount = await CompanyTaskSubmission.countDocuments({
      student: studentId,
      isCorrect: true,
    });

    let level = null;
    if (solvedCount >= 10) level = "diamond";
    else if (solvedCount >= 6) level = "gold";
    else if (solvedCount >= 4) level = "silver";
    else if (solvedCount >= 2) level = "bronze";
    

    if (level) {
      await Badge.findOneAndUpdate(
        { profile: student.profileId, name: "Company Tasks Badge" },
        {
          profile: student.profileId,
          name: "Company Tasks Badge",
          description: `Awarded for solving ${solvedCount} company tasks`,
          level,
          type: "achievement",
        },
        { upsert: true, new: true }
      );
    }
  }

  return {
    message: isCorrect
      ? "Solution submitted successfully"
      : "Solution submitted but not correct",
    data: submission,
  };
};

export const getAllTasks = async (pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const total = await CompanyTask.countDocuments({ isActive: true });

  const tasks = await CompanyTask.find({ isActive: true })
    .skip(skip)
    .limit(limit)
    .populate("company", "name email");

  return {
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getTasks = async (companyId, pagination) => {
  const { skip, limit, page } = pagination;

  const total = await CompanyTask.countDocuments({ company: companyId });

  const tasks = await CompanyTask.find({ company: companyId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    message: "Company tasks retrieved successfully",
    data: tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (taskId) => {
  const task = await CompanyTask.findById(taskId).populate("company", "name email");
  if (!task) throw new AppError("Task not found", 404);

  return { message: "Task retrieved successfully", data: task };
};

export const getTaskSubmissionsCompany = async (taskId, pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const total = await CompanyTaskSubmission.countDocuments({ task: taskId });

  const submissions = await CompanyTaskSubmission.find({ task: taskId })
    .skip(skip)
    .limit(limit)
    .populate("student", "name email");

  return {
    data: submissions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getStudentTraiesTaskSubmissions = async (studentId, pagination) => {
  const { skip, limit, page } = pagination;

  const total = await CompanyTaskSubmission.countDocuments({ student: studentId });

  const submissions = await CompanyTaskSubmission.find({ student: studentId })
    .populate("task", "title")
    .skip(skip)
    .limit(limit);

  return {
    message: "Student submissions retrieved successfully",
    data: submissions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deleteTask = async (taskId, companyId) => {
  const task = await CompanyTask.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  if (task.company.toString() !== companyId.toString())
    throw new AppError("Not authorized to delete this task.", 403);

  await CompanyTaskSubmission.deleteMany({ task: taskId });
  await CompanyTask.findByIdAndDelete(taskId);

  return { message: "Task and related submissions deleted successfully" };
};