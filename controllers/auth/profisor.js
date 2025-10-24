import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { registerProfessor, loginProfessor } from "../../services/authService.js"

export const professorRegister = catchAsync(async (req, res) => {
  const result = await registerProfessor(req.body);
  successResponse(res, result.data, result.message, 201);
});

export const professorLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginProfessor(email, password);
  successResponse(res, result.data, result.message);
});