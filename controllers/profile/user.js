import { successResponse } from "../../utils/responseHandler.js";
import { getProfile, updateProfile } from "../../services/profile.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getUserProfile = catchAsync(async (req, res) => {
  const result = await getProfile(req.user._id);
  successResponse(res, result.data, result.message, 200);
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const result = await updateProfile(req.user._id, req.body);
  successResponse(res, result.data, result.message, 200);
});
