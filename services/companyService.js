import Company from "../models/company.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const getCompanyProfile = async (userId) => {
  const profile = await Company.findOne({ user: userId })
  .populate("user", "name email role avatar coverImage");;
  if (!profile) throw new AppError("Profile not found", 404);
  return {
    message: "Profile fetched successfully",
    data: {
      user: profile.user,
      companyName: profile.companyName,
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

export const updateCompanyProfile = async (userId, updates, files) => {
  const company = await Company.findOneAndUpdate(
    { user: userId },
    updates,
    { new: true, runValidators: true }
  );
  if (!company) throw new AppError("Company profile not found", 404);
  const userUpdates = {};
  if (files?.avatar) {
    userUpdates.avatar = files.avatar[0].path.replace(/\\/g, "/");
  }
  if (files?.coverImage) {
    userUpdates.coverImage = files.coverImage[0].path.replace(/\\/g, "/");
  }
  let updatedUser = null;
  if (Object.keys(userUpdates).length > 0) {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      userUpdates,
      { new: true }
    ).select("name email role avatar coverImage");
  } else {
    updatedUser = await User.findById(userId).select("name email role avatar coverImage");
  }

  return {
    message: "Company profile updated successfully",
    data: {
      user: updatedUser,
      ...company.toObject()
    }
  };
};
