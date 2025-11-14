import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createQuestionWithTags, listQuestions, getQuestionDetails, deleteQuestion } from "../../services/questionService.js";

export const createQuestionController = catchAsync(async (req, res) => {
  const question = await createQuestionWithTags(req.user, req);
  successResponse(res, question, "Question created", 201);
});

export const listQuestionsController = catchAsync(async (req, res) => {
  const data = await listQuestions();
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