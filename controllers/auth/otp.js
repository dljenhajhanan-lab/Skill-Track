import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { requestResetService, verifyOTPService, resetPasswordService } from "../../services/otpService.js";

export const requestReset = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await requestResetService(email);
  successResponse(res, null, result.message, 200);
});

export const verifyOTP = catchAsync(async (req, res) => {
  const { email, code } = req.body;
  const result = await verifyOTPService(email, code);
  successResponse(res, { resetToken: result.resetToken }, result.message, 200);
});

export const resetPassword = catchAsync(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const result = await resetPasswordService(resetToken, newPassword);
  successResponse(res, null, result.message, 200);
});
