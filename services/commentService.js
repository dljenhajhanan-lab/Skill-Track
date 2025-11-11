import Comment from "../models/comment.js";
import Post from "../models/post.js";
import Question from "../models/question.js";
import Report from "../models/report.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const addComment = async (user, postId, data) => {
  const post = await Post.findById(postId);
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);

  const comment = await Comment.create({
    postId,
    authorId: user._id,
    parentCommentId: data.parentCommentId || null,
    content: data.content
  });

  if (data.parentCommentId) {
    await Comment.findByIdAndUpdate(data.parentCommentId, {
      $inc: { "counters.replies": 1 }
    });
  }

  await Post.findByIdAndUpdate(postId, { $inc: { "counters.comments": 1 } });

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

  const question = await Question.findById(comment.postId);
  if (!question) throw new AppError("Question not found", 404);

  const isAuthor = String(question.authorId) === String(user._id);
  const isProfessor = user.role === "professor";
  if (!isAuthor && !isProfessor) throw new AppError("Not allowed", 403);
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
  if (!comment || comment.deletedAt) throw new AppError("Comment not found", 404);
  const post = await Post.findById(comment.postId);
  if (!post) throw new AppError("Post not found", 404);
  const isPostOwner = String(post.authorId) === String(user._id);
  if (!isPostOwner) throw new AppError("Only post owner can report comments", 403);
  await Report.create({
    reporterId: user._id,
    targetType: "comment",
    targetId: commentId,
    reason
  });
  comment.counters.reports += 1;
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
