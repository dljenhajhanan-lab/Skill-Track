import { successResponse } from "../../utils/responseHandler.js";
import { getProfile, updateProfile } from "../../services/profile.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getUserProfile = catchAsync(async (req, res) => {
  const result = await getProfile(req.user._id);
  successResponse(res, result.data, result.message, 200);
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const updates = { ...req.body };
  if (req.files?.avatar) {
    updates.avatar = req.files.avatar[0].path.replace(/\\/g, "/");
  }
  if (req.files?.coverImage) {
    updates.coverImage = req.files.coverImage[0].path.replace(/\\/g, "/");
  }
  const result = await updateProfile(req.user._id, updates, req.files);

  successResponse(res, result.data, result.message, 200);
});
