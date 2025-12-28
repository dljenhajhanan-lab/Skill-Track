import Tag from "../models/tag.js";
import Comment from "../models/comment.js";

export const getSuggestedSolutionsForQuestion = async (question) => {
  const tagDoc = await Tag.findOne({
    targetType: "question",
    targetId: question._id
  }).lean();

  if (!tagDoc || !tagDoc.tags.length) return [];

  const similarTagDocs = await Tag.find({
    targetType: "question",
    tags: { $in: tagDoc.tags },
    targetId: { $ne: question._id }
  }).lean();

  if (!similarTagDocs.length) return [];

  const similarQuestionIds = similarTagDocs.map(t => t.targetId);
  const acceptedComments = await Comment.find({
    targetType: "question",
    targetId: { $in: similarQuestionIds },
    deletedAt: null,
    $or: [
      { "acceptedBy.author": true },
      { "acceptedBy.professor": true }
    ]
  })
    .populate("authorId", "name role email avatar")
    .populate({
      path: "targetId",
      model: "Question",
      select: "title content authorId createdAt",
      populate: {
        path: "authorId",
        model: "User",
        select: "name email avatar role"
      }
    })
    .sort({ createdAt: -1 })
    .lean();

  return acceptedComments.map(comment => {
    const tagInfo = similarTagDocs.find(
      t => String(t.targetId) === String(comment.targetId?._id)
    );

    return {
      _id: comment._id,
      solutionContent: comment.content,
      solutionAuthor: comment.authorId,
      acceptedBy: comment.acceptedBy,
      similarQuestion: {
        _id: comment.targetId?._id,
        title: comment.targetId?.title,
        content: comment.targetId?.content,
        createdAt: comment.targetId?.createdAt,
        questionAuthor: comment.targetId?.authorId
      },
      matchedTags: (tagInfo?.tags || []).filter(tag => tagDoc.tags.includes(tag)),
      createdAt: comment.createdAt
    };
  });
};
