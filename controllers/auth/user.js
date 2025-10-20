import { registerUser, loginUser } from "../../services/authService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const register = catchAsync(async (req, res) => {
  const result = await registerUser(req.body);
  return successResponse(res, result.data, result.message, 201);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  return successResponse(res, result.data, result.message, 200);
});
