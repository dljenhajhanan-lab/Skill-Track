import Question from "../models/question.js";
import Comment from "../models/comment.js";
import Tag from "../models/tag.js";
import { AppError } from "../utils/appError.js";
import { normalizePagination } from "../utils/paginate.js"
import { extractTagsWithAI } from "./aiTagService.js";

export const createQuestionWithTags = async (user, req) => {
  const file = req.files?.questionImage?.[0];
  const imageUrl = file ? `/uploads/questions/${file.filename}` : null;

  const { title, content, linkUrl } = req.body;

  const question = await Question.create({
    authorId: user._id,
    authorRole: user.role,
    title,
    content,
    linkUrl: linkUrl || null,
    imageUrl,
    tags: []
  });

  const aiTags = await extractTagsWithAI(title, content);
  await Question.findByIdAndUpdate(question._id, { tags: aiTags });
  await Tag.findOneAndUpdate(
  {
    targetType: "question",
    targetId: question._id
  },
  {
    tags: aiTags,
    source: "openrouter"
  },
  { upsert: true, new: true }
);

  return Question.findById(question._id);
};

export const listQuestions = async (pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const total = await Question.countDocuments({ deletedAt: null });

  const questions = await Question.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("authorId", "fullName role email avatar");

  return {
    data: questions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getQuestionDetails = async (questionId) => {
  const question = await Question.findById(questionId)
    .populate("authorId", "fullName role")
    .lean();

  if (!question || question.deletedAt) {
    throw new AppError("Question not found", 404);
  }
  const comments = await Comment.find({
    targetType: "question",
    targetId: questionId,
    deletedAt: null
  })
    .populate("authorId", "fullName role")
    .sort({ createdAt: 1 })
    .lean();
  const tagDoc = await Tag.findOne({ post: questionId }).lean();

  return {
    question,
    tags: tagDoc?.tags || [],
    comments,
    reactions: {
      questionReactions: question?.counters?.reactions || 0,
      commentReactions: comments.reduce(
        (sum, c) => sum + (c?.counters?.reactions || 0),
        0
      )
    }
  };
};

export const deleteQuestion = async (user, questionId) => {
  const question = await Question.findById(questionId);
  if (!question || question.deletedAt) {
    throw new AppError("Question not found", 404);
  }

  const isOwner = String(question.authorId) === String(user._id);
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Not allowed to delete this question", 403);
  }

  question.deletedAt = new Date();
  await question.save();

  return true;
};

export const getUserQuestions = async (userId, pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const filter = { authorId: userId, deletedAt: null };
  const total = await Question.countDocuments(filter);

  const questions = await Question.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("authorId", "name email avatar role");

  return {
    data: questions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
