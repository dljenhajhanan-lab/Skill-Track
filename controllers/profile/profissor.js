import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createProfessorProfile, getProfessorProfile, updateProfessorProfile }from "../../services/professorService.js";

export const createProfessor = catchAsync(async (req, res) => {
  const result = await createProfessorProfile(req.user._id, req.body);
  successResponse(res, result.data, result.message, 201);
});

export const getProfessor = catchAsync(async (req, res) => {
  const result = await getProfessorProfile(req.user._id);
  successResponse(res, result.data, result.message, 200);
});

export const updateProfessor = catchAsync(async (req, res) => {
  const result = await updateProfessorProfile(req.user._id, req.body);
  successResponse(res, result.data, result.message, 200);
});
