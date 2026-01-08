import Reaction from "../models/reaction.js";
import Post from "../models/post.js";
import Question from "../models/question.js";
import Comment from "../models/comment.js";
import { AppError } from "../utils/appError.js";
import { sendNotification } from "./notification.service.js";


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

    let targetDoc;
    let receiverId;

    switch (targetType) {
      case "post":
        targetDoc = await Post.findById(targetId).select("authorId");
        break;

      case "question":
        targetDoc = await Question.findById(targetId).select("authorId");
        break;

      case "comment":
        targetDoc = await Comment.findById(targetId).select("authorId");
        break;
    }

    receiverId = targetDoc?.authorId;

    if (
      receiverId &&
      receiverId.toString() !== user._id.toString()
    ) {
      const receiver = await User.findById(receiverId);

      if (receiver?.fcmToken) {
        await sendNotification({
          senderId: user._id,
          receiverId: receiver._id,
          title: "New Reaction",
          body: "Someone reacted to your content",
          data: {
            targetId: targetId.toString(),
            targetType,
            reactionType: type,
            type: "REACTION"
          }
        });
      }
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
