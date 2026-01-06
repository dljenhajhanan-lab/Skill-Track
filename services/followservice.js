import { sendNotification } from "../services/notification.service.js";
import Follow  from "../models/follow.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";
import { normalizePagination } from "../utils/paginate.js"


const validFollowRules = {
  student: ["professor", "company", "student"],
  professor: ["student", "professor"],
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

  const exist = await Follow.findOne({
    follower: followerId,
    following: targetId,
  });
  if (exist) throw new AppError("Already following this user", 400);

  
  const follow = await Follow.create({
    follower: followerId,
    following: targetId,
  });

  
  await sendNotification({
    senderId: follower._id,
    receiverId: following._id,
    receiverFcmToken: following.fcm_token, 
    title: " New Follow",
    body: `${follower.name}  starting follow you`,
    data: {
      type: "follow",
      followerId: follower._id.toString(),
    },
  });

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

export const getFollowing = async (userId, pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const total = await Follow.countDocuments({ follower: userId });

  const following = await Follow.find({ follower: userId })
    .skip(skip)
    .limit(limit)
    .populate("following", "name avatar email role");

  return {
    data: following,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getFollowers = async (userId, pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const total = await Follow.countDocuments({ following: userId });

  const followers = await Follow.find({ following: userId })
    .skip(skip)
    .limit(limit)
    .populate("follower", "name avatar email role");

  return {
    data: followers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const checkFollowStatus = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) {
    throw new AppError("Invalid users", 400);
  }

  const isFollowing = await Follow.exists({
    follower: currentUserId,
    following: targetUserId,
  });

  const isFollower = await Follow.exists({
    follower: targetUserId,
    following: currentUserId,
  });

  return {
    isFollowing: !!isFollowing,
    isFollower: !!isFollower,
  };
};
