import Company from "../models/company.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const createCompanyProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const existing = await Company.findOne({ user: userId });
  if (existing) throw new AppError("Profile already exists", 400);

  const profile = await Company.create({
    user: userId,
    companyName: data.companyName,
    bio: data.bio,
  });

  return {
    message: "Company profile created successfully",
    data: profile,
  };
};

export const getCompanyProfile = async (userId) => {
  const profile = await Company.findOne({ user: userId }).populate(
    "user",
    "name email role"
  );
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Company fetched successfully",
    data: profile,
  };
};

export const updateCompanyProfile = async (userId, updates) => {
  const profile = await Company.findOneAndUpdate({ user: userId }, updates, {
    new: true,
    runValidators: true,
  });
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile updated successfully",
    data: profile,
  };
};
