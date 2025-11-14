import Comment from "../models/comment.js";
import Post from "../models/post.js";
import Question from "../models/question.js";
import Report from "../models/report.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const addComment = async (user, targetType, targetId, data) => {
  let targetDoc;

  if (targetType === "post") {
    targetDoc = await Post.findById(targetId);
  } else if (targetType === "question") {
    targetDoc = await Question.findById(targetId);
  } else {
    throw new AppError("Invalid target type", 400);
  }

  if (!targetDoc || targetDoc.deletedAt) {
    throw new AppError(`${targetType === "post" ? "Post" : "Question"} not found`, 404);
  }

  const comment = await Comment.create({
    targetId,
    targetType,
    authorId: user._id,
    parentCommentId: data.parentCommentId || null,
    content: data.content
  });

  if (data.parentCommentId) {
    await Comment.findByIdAndUpdate(data.parentCommentId, {
      $inc: { "counters.replies": 1 }
    });
  }

  if (targetType === "post") {
    await Post.findByIdAndUpdate(targetId, { $inc: { "counters.comments": 1 } });
  } else {
    await Question.findByIdAndUpdate(targetId, { $inc: { "counters.comments": 1 } });
  }

  return comment;
};

export const deleteComment = async (user, commentId) => {
  const c = await Comment.findById(commentId);
  if (!c || c.deletedAt) throw new AppError("Comment not found", 404);

  const post = await Post.findById(c.postId);
  const isOwner = String(post.authorId) === String(user._id);
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new AppError("Not allowed", 403);

  c.deletedAt = new Date();
  await c.save();

  await Post.findByIdAndUpdate(c.postId, { $inc: { "counters.comments": -1 } });

  return true;
};

export const markSolution = async (user, commentId, checked) => {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.deletedAt) throw new AppError("Comment not found", 404);

  if (comment.targetType !== "question")
    throw new AppError("This comment is not attached to a question", 400);

  const question = await Question.findById(comment.targetId);
  if (!question) throw new AppError("Question not found", 404);

  const isAuthor = String(question.authorId) === String(user._id);
  const isProfessor = user.role === "professor";

  if (!isAuthor && !isProfessor)
    throw new AppError("Not allowed", 403);

  if (!comment.acceptedBy) {
    comment.acceptedBy = { author: false, professor: false };
  }

  if (isAuthor) comment.acceptedBy.author = checked;
  if (isProfessor) comment.acceptedBy.professor = checked;

  await comment.save();

  question.isSolved =
    comment.acceptedBy.author && comment.acceptedBy.professor ? true : false;

  question.solutionCommentId = question.isSolved ? comment._id : null;
  await question.save();

  return {
    comment: {
      _id: comment._id,
      content: comment.content,
      acceptedBy: comment.acceptedBy
    },
    question: {
      _id: question._id,
      isSolved: question.isSolved
    }
  };
};

export const reportComment = async (user, commentId, reason) => {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.deletedAt)
    throw new AppError("Comment not found", 404);

  let targetDoc = null;
  if (comment.targetType === "post") {
    targetDoc = await Post.findById(comment.targetId);
  } else if (comment.targetType === "question") {
    targetDoc = await Question.findById(comment.targetId);
  } else {
    throw new AppError("Invalid target type", 400);
  }

  if (!targetDoc) throw new AppError(`${comment.targetType} not found`, 404);

  const isOwner = String(targetDoc.authorId) === String(user._id);
  if (!isOwner)
    throw new AppError(
      "Only the author of the post/question can report comments",
      403
    );

  await Report.create({
    reporterId: user._id,
    targetType: "comment",
    targetId: commentId,
    reason
  });

  comment.counters.reports = (comment.counters.reports || 0) + 1;
  await comment.save();

  const author = await User.findById(comment.authorId);
  author.reportCount += 1;
  if (author.reportCount >= 3) author.isBanned = true;
  await author.save();

  return {
    reported: true,
    banned: author.isBanned,
    reportsCount: comment.counters.reports
  };
};