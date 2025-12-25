import Tag from "../models/tag.js";
import Comment from "../models/comment.js";

export const getSuggestedSolutionsForQuestion = async (question) => {
  const tagDoc = await Tag.findOne({
    targetType: "question",
    targetId: question._id
  }).lean();

  if (!tagDoc || !tagDoc.tags.length) return [];
  const similarTagDocs = await Tag.find({
    tags: { $in: tagDoc.tags },
    post: { $ne: question._id }
  }).lean();

  if (!similarTagDocs.length) return [];

  const similarQuestionIds = similarTagDocs.map(t => t.post);
  const acceptedComments = await Comment.find({
    targetType: "question",
    targetId: { $in: similarQuestionIds },
    deletedAt: null,
    $or: [
      { "acceptedBy.author": true },
      { "acceptedBy.professor": true }
    ]
  })
    .populate("authorId", "name role")
    .sort({ createdAt: 1 });

  return acceptedComments;
};
