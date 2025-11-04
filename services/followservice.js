import { Follow } from "../models/follow.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

const validFollowRules = {
  student: ["professor", "company", "student"],
  professor: ["student"],
  company: ["student"],
};

export const createFollow = async (followerId, targetId) => {
  const follower = await User.findById(followerId);
  const following = await User.findById(targetId);

  if (!follower || !following) throw new AppError("Invalid user", 404);

  if (followerId.toString() === targetId)
    throw new AppError("You can't follow yourself", 400);

  const allowedTargets = validFollowRules[follower.role] || [];
  if (!allowedTargets.includes(following.role))
    throw new AppError(
      `User role "${follower.role}" cannot follow "${following.role}"`,
      403
    );

  const exist = await Follow.findOne({ follower: followerId, following: targetId });
  if (exist) throw new AppError("Already following this user", 400);

  const follow = await Follow.create({ follower: followerId, following: targetId });

  return {
    message: "Follow successful",
    data: follow,
  };
};

export const unfollow = async (followerId, targetId) => {
  const follow = await Follow.findOneAndDelete({ follower: followerId, following: targetId });
  if (!follow) throw new AppError("No follow relationship found", 404);

  return {
    message: "Unfollow successful",
  };
};

export const getFollowing = async (userId) => {
  const following = await Follow.find({ follower: userId }).populate(
    "following",
    "name email role profileImage"
  );

  return {
    message: "Following list retrieved successfully",
    data: following,
  };
};

export const getFollowers = async (userId) => {
  const followers = await Follow.find({ following: userId }).populate(
    "follower",
    "name email role profileImage"
  );

  return {
    message: "Followers list retrieved successfully",
    data: followers,
  };
};