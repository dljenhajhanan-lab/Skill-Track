import Reaction from "../models/reaction.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import { AppError } from "../utils/appError.js";

export const toggleReaction = async (user, body) => {
  const { targetType, targetId, kind } = body;
  if (!["post", "comment"].includes(targetType)) throw new AppError("Invalid", 400);
  const Target = targetType === "post" ? Post : Comment;
  const target = await Target.findById(targetId);
  if (!target || target.deletedAt) throw new AppError("Not found", 404);
  const existing = await Reaction.findOne({ userId: user._id, targetType, targetId });
  if (!existing) {
    await Reaction.create({ userId: user._id, targetType, targetId, kind });
    await Target.findByIdAndUpdate(targetId, { $inc: { "counters.reactions": 1 } });
    return { status: "added", kind };
  }
  if (existing.kind === kind) {
    await existing.deleteOne();
    await Target.findByIdAndUpdate(targetId, { $inc: { "counters.reactions": -1 } });
    return { status: "removed" };
  }
  existing.kind = kind;
  await existing.save();
  return { status: "updated", kind };
};
