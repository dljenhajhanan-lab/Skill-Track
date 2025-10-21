import { loginAdmin } from "../../services/authService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";

export const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginAdmin(email, password);
  return successResponse(res, result.data, result.message, 200);
});
