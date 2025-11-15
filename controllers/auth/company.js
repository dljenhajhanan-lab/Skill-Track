import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { registerCompany, loginCompany } from "../../services/authService.js"

export const companyRegister = catchAsync(async (req, res) => {
  const result = await registerCompany(req);
  successResponse(res, result.data, result.message, 201);
});

export const companyLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginCompany(email, password);
  successResponse(res, result.data, result.message);
});