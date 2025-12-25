import Tag from "../models/tag.js";
import Question from "../models/question.js";

export const findSimilarQuestionsByTags = async (tags, excludeQuestionId) => {
  const tagDocs = await Tag.find({
    tags: { $in: tags },
    post: { $ne: excludeQuestionId }
  }).lean();

  const questionIds = tagDocs.map(t => t.post);

  return Question.find({
    _id: { $in: questionIds },
    deletedAt: null
  });
};
