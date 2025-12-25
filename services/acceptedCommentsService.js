import Comment from "../models/comment.js";

export const getAcceptedComments = async (questionIds) => {
  return Comment.find({
    targetType: "question",
    targetId: { $in: questionIds },
    deletedAt: null,
    $or: [
      { "acceptedBy.author": true },
      { "acceptedBy.professor": true }
    ]
  })
  .populate("authorId", "name role")
  .sort({ createdAt: 1 });
};