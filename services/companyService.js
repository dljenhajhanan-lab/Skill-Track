import Company from "../models/company.js";
import { AppError } from "../utils/appError.js";

export const getCompanyProfile = async (userId) => {
  const profile = await Company.findOne({ user: userId }).populate(
    "user",
    "name email role avatar coverImage"
  );
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Company fetched successfully",
    data: profile
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
