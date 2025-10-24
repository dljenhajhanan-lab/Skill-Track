import Profile from "../models/profile.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const createProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const existing = await Profile.findOne({ user: userId });
  if (existing) throw new AppError("Profile already created", 400);

  const profile = await Profile.create({
    user: userId,
    fullName: data.fullName || user.name,
    bio: data.bio,
    avatar: data.avatar,
    coverImage: data.coverImage,
    university: data.university,
    phone: data.phone,
    address: data.address,
    socialLinks: data.socialLinks,
    // skills: data.skills || [],
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
  });

  return {
    message: "Profile already created",
    data: profile,
  };
};

export const getProfile = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate("user", "name email role");
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile fetched successfully",
    data: profile,
  };
};

export const updateProfile = async (userId, updates) => {
  const profile = await Profile.findOneAndUpdate({ user: userId }, updates, {
    new: true,
    runValidators: true,
  });

  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile updated successfully",
    data: profile,
  };
};
