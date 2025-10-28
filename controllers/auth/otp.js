import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { requestResetService, verifyAndResetService } from "../../services/otpService.js";

export const requestReset = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await requestResetService(email);
  successResponse(res, null, result.message, 200);
});

export const verifyAndReset = catchAsync(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const result = await verifyAndResetService(email, code, newPassword);
  successResponse(res, null, result.message, 200);
});
