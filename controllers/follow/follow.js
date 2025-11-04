import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createFollow, unfollow, getFollowing, getFollowers } from "../../services/followservice.js";

export const sendFollow = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.targetId;

  const result = await createFollow(userId, targetId);
  successResponse(res, result, "Follow successful", 201);
});

export const unfollowController = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.targetId;

  await unfollow(userId, targetId);
  successResponse(res, null, "Unfollow successful");
});

export const getFollowingController = catchAsync(async (req, res) => {
  const result = await getFollowing(req.params.userId);
  successResponse(res, result, "Following list retrieved successfully");
});

export const getFollowersController = catchAsync(async (req, res) => {
  const result = await getFollowers(req.params.userId);
  successResponse(res, result, "Followers list retrieved successfully");
});
