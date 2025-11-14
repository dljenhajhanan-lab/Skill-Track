import Question from "../models/question.js";
import Comment from "../models/comment.js";
import Tag from "../models/tag.js";
import { AppError } from "../utils/appError.js";

export const createQuestionWithTags = async (user, req) => {
  const file = req.files?.questionImage?.[0];
  const imageUrl = file ? `/uploads/questions/${file.filename}` : null;

  const { title, content, linkUrl, tags } = req.body;

  const question = await Question.create({
    authorId: user._id,
    authorRole: user.role,
    title,
    content,
    linkUrl: linkUrl || null,
    imageUrl,
    tags: tags ? tags.split(",").map(t => t.trim()) : []
  });

  return question;
};

export const listQuestions = async () => {
  const questions = await Question.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .populate("authorId", "fullName role")
    .lean();

  const ids = questions.map(q => q._id);

  const countsAgg = await Comment.aggregate([
    { $match: { questionId: { $in: ids }, deletedAt: null } },
    { $group: { _id: "$questionId", count: { $sum: 1 } } }
  ]);

  const mapCounts = Object.fromEntries(countsAgg.map(c => [String(c._id), c.count]));

  const tagDocs = await Tag.find({ question: { $in: ids } }).lean();
  const mapTags = Object.fromEntries(tagDocs.map(t => [String(t.question), t.tags]));

  return questions.map(q => ({
    _id: q._id,
    title: q.title,
    author: q.authorId,
    content: q.content,
    linkUrl: q.linkUrl,
    imageUrl: q.imageUrl,
    createdAt: q.createdAt,
    isSolved: q.isSolved,
    commentCount: mapCounts[String(q._id)] || 0,
    tags: mapTags[String(q._id)] || []
  }));
};

export const getQuestionDetails = async (questionId) => {
  const question = await Question.findById(questionId)
    .populate("authorId", "fullName role")
    .lean();

  if (!question || question.deletedAt) throw new AppError("Question not found", 404);

  const comments = await Comment.find({ questionId, deletedAt: null })
    .populate("authorId", "fullName role")
    .sort({ createdAt: 1 })
    .lean();

  const tagDoc = await Tag.findOne({ question: questionId }).lean();

  const reactions = {
    questionReactions: question?.counters?.reactions || 0,
    commentReactions: comments.reduce((a, c) => a + (c?.counters?.reactions || 0), 0)
  };

  return { question, tags: tagDoc?.tags || [], comments, reactions };
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