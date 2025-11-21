import Professor from "../models/professor.js";
import { AppError } from "../utils/appError.js";
import User from "../models/user.js";

export const getProfessorProfile = async (userId) => {
  const profile = await Professor.findOne({ user: userId }).populate(
    "user",
    "name email role avatar coverImage"
  );
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile fetched successfully",
    data: {
      user: profile.user,
      specialization: profile.specialization,
      fullName: profile.fullName,
      bio: profile.bio,
      university: profile.university,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      socialLinks: profile.socialLinks,
      postion: profile.postion
    },
  };
};

export const updateProfessorProfile = async (userId, updates, files) => {

  const profile = await Professor.findOneAndUpdate(
    { user: userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!profile) throw new AppError("Profile not found", 404);

  const userUpdates = {};

  if (files?.avatar) {
    userUpdates.avatar = files.avatar[0].path.replace(/\\/g, "/");
  }

  if (files?.coverImage) {
    userUpdates.coverImage = files.coverImage[0].path.replace(/\\/g, "/");
  }

  let updatedUser = await User.findByIdAndUpdate(
    userId,
    userUpdates,
    { new: true }
  );

  updatedUser = await User.findById(userId)
    .select("name email role avatar coverImage");

  return {
    message: "Professor profile updated successfully",
    data: {
      user: updatedUser,
      ...profile.toObject()
    }
  };
};
