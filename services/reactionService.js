import Reaction from "../models/reaction.js";
import Post from "../models/post.js";
import Question from "../models/question.js";
import Comment from "../models/comment.js";
import { AppError } from "../utils/appError.js";

const findTarget = async (targetType, targetId) => {
  if (targetType === "post") {
    const post = await Post.findById(targetId);
    if (!post || post.deletedAt) throw new AppError("Post not found", 404);
    return post;
  }
  if (targetType === "question") {
    const question = await Question.findById(targetId);
    if (!question || question.deletedAt) throw new AppError("Question not found", 404);
    return question;
  }
   else if (targetType === "comment") {
    const comment = await Comment.findById(targetId);
    if (!comment || comment.deletedAt) throw new AppError("Comment not found", 404);
    return comment;
  }
  throw new AppError("Invalid target type", 400);
};

const updateReactionCounter = async (targetType, targetId, delta) => {
  if (targetType === "post") {
    await Post.findByIdAndUpdate(targetId, { $inc: { "counters.reactions": delta } });
  }
  if (targetType === "question") {
    await Question.findByIdAndUpdate(targetId, { $inc: { "counters.reactions": delta } });
  }  
  else if (targetType === "comment") {
    await Comment.findByIdAndUpdate(targetId, { $inc: { "counters.reactions": delta } });
  }
};

export const addOrUpdateReaction = async (user, targetType, targetId, type) => {
  const existing = await Reaction.findOne({
    userId: user._id,
    targetId,
    targetType,
  });

  if (!existing) {
    const reaction = await Reaction.create({
      userId: user._id,
      targetId,
      targetType,
      type
    });

    await updateReactionCounter(targetType, targetId, +1);
    if (user.role === "professor") {
      await ProfessorActivity.findOneAndUpdate(
        { professor: user._id },
        {
          $inc: {
            reactionsCount: 1,
            totalPoints: 1,
          },
        },
        { upsert: true }
      );
    }

    return reaction;
  }

  existing.type = type;
  await existing.save();
  return existing;
};

export const removeReaction = async (user, targetType, targetId) => {
  const deleted = await Reaction.findOneAndDelete({
    userId: user._id,
    targetId,
    targetType
  });

  if (!deleted) throw new AppError("Reaction not found", 404);

  await updateReactionCounter(targetType, targetId, -1);
  if (user.role === "professor") {
    await ProfessorActivity.findOneAndUpdate(
      { professor: user._id },
      {
        $inc: {
          reactionsCount: -1,
          totalPoints: -1,
        },
      }
    );
  }

  return true;
};


export const countReactions = async (targetType, targetId) => {
  return await Reaction.countDocuments({ targetType, targetId });
};

export const getReactionsByTarget = async (targetType, targetId) => {
  const reactions = await Reaction.find({ targetType, targetId })
    .populate("userId", "fullName role")
    .lean();
  return reactions;
};
