import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createQuestionWithTags,listQuestions,getQuestionDetails,deleteQuestion } from "../../services/questionService.js";
import { getSuggestedSolutionsForQuestion } from "../../services/suggestedSolutionsService.js";
import Question from "../../models/question.js"

export const createQuestionController = catchAsync(async (req, res) => {
  const question = await createQuestionWithTags(req.user, req);
  successResponse(res, question, "Question created", 201);
});

export const listQuestionsController = catchAsync(async (req, res) => {
  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
  };
  const data = await listQuestions(pagination);
  successResponse(res, data, "OK");
});

export const getQuestionDetailsController = catchAsync(async (req, res) => {
  const data = await getQuestionDetails(req.params.id);
  successResponse(res, data, "OK");
});

export const deleteQuestionController = catchAsync(async (req, res) => {
  await deleteQuestion(req.user, req.params.id);
  successResponse(res, null, "Question deleted successfully");
});

export const getSuggestedSolutionsController = catchAsync(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question || question.deletedAt) {
    throw new AppError("Question not found", 404);
  }
  if (question.isSolved) {
    return successResponse(res, [], "Question already solved");
  }
  const solutions = await getSuggestedSolutionsForQuestion(question);
  successResponse(res, solutions, "Suggested solutions fetched");
});