import { loginAdmin } from "../../services/authService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { logoutUser } from "../../services/authService.js ";


export const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginAdmin(email, password);
  return successResponse(res, result.data, result.message, 200);
});



export const logout = catchAsync(async (req, res) => {
  const result = await logoutUser(req);
  successResponse(res, result, result.message, 200);
});
