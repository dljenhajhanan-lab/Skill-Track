import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createFollow, unfollow, getFollowing, getFollowers, checkFollowStatus } from "../../services/followservice.js";

export const sendFollow = catchAsync(async (req, res) => {
  const result = await createFollow(req.user._id, req.params.targetId);
  successResponse(res, result, "Follow successful", 201);
});

export const unfollowController = catchAsync(async (req, res) => {
  await unfollow(req.user._id, req.params.targetId);
  successResponse(res, null, "Unfollow successful");
});

export const getFollowingController = catchAsync(async (req, res) => {
  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
  };

  const result = await getFollowing(req.params.userId, pagination);
  successResponse(res, result, "Following list retrieved successfully");
});

export const getFollowersController = catchAsync(async (req, res) => {
  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
  };

  const result = await getFollowers(req.params.userId, pagination);
  successResponse(res, result, "Followers list retrieved successfully");
});

export const checkFollowStatusController = catchAsync(async (req, res) => {
  const result = await checkFollowStatus(req.user._id,req.params.targetId);
  successResponse(res,result,"Follow status retrieved successfully");
});
