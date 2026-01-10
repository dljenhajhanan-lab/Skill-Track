import axios from "axios";
import { CompanyTask } from "../models/companyTask.js";
import { CompanyTaskSubmission } from "../models/companyTaskSubmission.js";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import { AppError } from "../utils/appError.js";
import Badge from "../models/badge.js";
import { createItem } from "./profileItems.js";
import Project from "../models/project.js";
import { normalizePagination } from "../utils/paginate.js";
import { addPoints } from "./points.js";

const NO_HINT_BONUS_MULTIPLIER = 1.2;

const RANK_MULTIPLIERS = {
  1: 1.0,
  2: 0.9,
  3: 0.8,
  default: 0.7,
};


export const evaluateSolutionWithAI = async ({
  studentCode,
  referenceCode,
  expectedLanguage,
}) => {
  try {
    const prompt = `
You are a programming judge.

Ignore programming language completely.
Focus ONLY on whether the student solution
solves the same problem and produces the same result.

Reference Solution:
${referenceCode}

Student Solution:
${studentCode}

If the student solution solves the same problem,
then is_correct MUST be true and score MUST be 100.

Respond ONLY with valid JSON:
{
  "is_correct": boolean,
  "score": number,
  "feedback": "string",
  "hint": "string"
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    const jsonStr = text.substring(start, end);

    const aiResult = JSON.parse(jsonStr);

    return {
      isCorrect: aiResult.is_correct,
      score: aiResult.score,
      similarityScore: aiResult.score,
      feedback: aiResult.feedback,
      hint: aiResult.hint,
      languageMatch: aiResult.language_match,
      languageStudent: expectedLanguage,
      languageReference: expectedLanguage,
      sameGoal: true,
    };
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);

    return {
      isCorrect: false,
      score: 0,
      similarityScore: 0,
      Feedback: "An error occurred while connecting to the Smart Assessment service.",
      Hint: "Make sure your OpenRouter key is correct and that you are connected to the internet.",
      languageMatch: false,
      sameGoal: false,
    };
  }
};

export const submitTaskSolution = async (studentId, taskId, body) => {
  const {
    codeAnswer,
    usedHints = false,
    hintsCount = 0,
    addToPortfolio = false,
  } = body;

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    throw new AppError("Only students can submit solutions.", 403);
  }

  const task = await CompanyTask.findById(taskId);
  if (!task || !task.isActive) {
    throw new AppError("Task is not available.", 400);
  }

  const attemptsCount = await CompanyTaskSubmission.countDocuments({
    task: taskId,
    student: studentId,
  });

  if (attemptsCount >= task.maxAttempts) {
    throw new AppError("Maximum attempts reached.", 400);
  }

  const attemptNumber = attemptsCount + 1;

  const ai = await evaluateSolutionWithAI({
    studentCode: codeAnswer,
    referenceCode: task.referenceSolution,
    expectedLanguage: task.language || "javascript",
  });

  const isCorrect = ai.isCorrect;
  let rank = null;
  let finalPoints = 0;

  if (isCorrect) {
  const solvedBefore = await CompanyTaskSubmission.countDocuments({
    task: taskId,
    isCorrect: true,
  });

  rank = solvedBefore + 1;
  let points = 0;

  if (!usedHints) points += 10;
  else points += 5;

  if (body.timeTakenSeconds && body.timeTakenSeconds < 1800) {
    points += 5;
  }

  if (rank <= 3) {
    points += 5;
  }
  await addPoints({
    studentId,
    type: "TASK",
    points,
    reason: "Solved company task",
    referenceId: taskId,
  });
  const rankMultiplier =
    RANK_MULTIPLIERS[rank] ?? RANK_MULTIPLIERS.default;

  const hintMultiplier = usedHints ? 1 : NO_HINT_BONUS_MULTIPLIER;

  finalPoints = Math.round(
    task.basePoints *
      (ai.score / 100) *
      rankMultiplier *
      hintMultiplier
  );

  await User.findByIdAndUpdate(studentId, {
    $inc: { points: finalPoints },
  });
  }


  const submission = await CompanyTaskSubmission.create({
    task: taskId,
    student: studentId,
    attemptNumber,
    codeAnswer,
    isCorrect,
    finalPoints,
    rank,
    usedHints,
    hintsCount,
    aiScore: ai.score,
    similarityScore: ai.similarityScore,
    aiFeedback: ai.feedback,
    aiHint: ai.hint,
    languageMatch: ai.languageMatch,
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

export const createTask = async (companyId, body) => {
  const company = await User.findById(companyId);
  if (!company || company.role !== "company") {
    throw new AppError("Only companies can create tasks.", 403);
  }

  const task = await CompanyTask.create({ ...body, company: companyId });
  return { message: "Task created successfully", data: task };
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
      totalPages: Math.ceil(total / limit),
    },
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
  const task = await CompanyTask.findById(taskId).populate(
    "company",
    "name email"
  );

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
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentTraiesTaskSubmissions = async (
  studentId,
  pagination
) => {
  const { skip, limit, page } = pagination;

  const total = await CompanyTaskSubmission.countDocuments({
    student: studentId,
  });

  const submissions = await CompanyTaskSubmission.find({
    student: studentId,
  })
    .populate("task", "title description")
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

  if (task.company.toString() !== companyId.toString()) {
    throw new AppError("Not authorized to delete this task.", 403);
  }

  await CompanyTaskSubmission.deleteMany({ task: taskId });
  await CompanyTask.findByIdAndDelete(taskId);

  return { message: "Task and related submissions deleted successfully" };
};
