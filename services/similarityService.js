import Tag from "../models/tag.js";
import Question from "../models/question.js";

export const findSimilarQuestionsByTags = async (tags, expectedTags) => {
  const tagDocs = await Tag.find({
    tags: { $in: tags },
    question: { $ne: expectedTags }
});

const questionIds = tagDocs.map(t => t.question);

  return Question.find({
    _id: { $in: questionIds },
    isSolved: true,
    deletedAt: null
  });
};
