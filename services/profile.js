import Profile from "../models/profile.js";
import { AppError } from "../utils/appError.js";

export const getProfile = async (userId) => {
  const profile = await Profile.findOne({ user: userId })
    .populate("user", "name email role  avatar coverImage");

  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile fetched successfully",
    data: {
      user: profile.user,
      fullName: profile.fullName,
      bio: profile.bio,
      avatar: profile.avatar,
      coverImage: profile.coverImage,
      university: profile.university,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      socialLinks: profile.socialLinks,
    },
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
