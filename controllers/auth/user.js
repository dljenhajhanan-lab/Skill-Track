import { registerUser, loginUser } from "../../services/authService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { catchAsync } from "../../utils/catchAsync.js";
import user from "../../models/user.js";

export const register = catchAsync(async (req, res) => {
  const result = await registerUser(req);
  return successResponse(res, result.data, result.message, 201);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  return successResponse(res, result.data, result.message, 200);
});

export const saveFcmToken = catchAsync(async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) {
    return res.status(400).json({ message: "FCM token is required" });
  }
  await user.findByIdAndUpdate(req.user._id, {
    fcmToken,
  });

  successResponse(res, null, "FCM token saved successfully");
});
