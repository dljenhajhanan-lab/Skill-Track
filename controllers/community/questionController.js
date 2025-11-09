import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createQuestionWithTags, listQuestions, getQuestionDetails } from "../../services/questionService.js";

export const createQuestionController = catchAsync(async (req, res) => {
  const post = await createQuestionWithTags(req.user, req.body);
  successResponse(res, post, "Created", 201);
});

export const listQuestionsController = catchAsync(async (req, res) => {
  const data = await listQuestions();
  successResponse(res, data, "OK");
});

export const getQuestionDetailsController = catchAsync(async (req, res) => {
  const data = await getQuestionDetails(req.params.id);
  successResponse(res, data, "OK");
});
