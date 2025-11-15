import Professor from "../models/professor.js";
import { AppError } from "../utils/appError.js";

export const getProfessorProfile = async (userId) => {
  const profile = await Professor.findOne({ user: userId }).populate(
    "user",
    "name email role avatar coverImage"
  );
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "profile fetched successfully",
    data: profile,
  };
};

export const updateProfessorProfile = async (userId, updates) => {
  const profile = await Professor.findOneAndUpdate({ user: userId }, updates, {
    new: true,
    runValidators: true,
  });
  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile updated successfully",
    data: profile,
  };
};
