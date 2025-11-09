import Comment from "../models/comment.js";
import Post from "../models/post.js";
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
  await Post.findByIdAndUpdate(postId, { $inc: { "counters.comments": 1 } });
  if (data.parentCommentId) await Comment.findByIdAndUpdate(data.parentCommentId, { $inc: { "counters.replies": 1 } });
  return comment;
};

export const deleteComment = async (user, commentId) => {
  const c = await Comment.findById(commentId);
  if (!c || c.deletedAt) throw new AppError("Comment not found", 404);
  const post = await Post.findById(c.postId);
  const isOwner = String(post.authorId) === String(user._id);
  if (!isOwner && user.role !== "admin") throw new AppError("Not allowed", 403);
  c.deletedAt = new Date();
  await c.save();
  return true;
};
