import Professor from "../models/professor.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const createProfessorProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const existing = await Professor.findOne({ user: userId });
  if (existing) throw new AppError("Profile already exists", 400);

  const profile = await Professor.create({
    user: userId,
    bio: data.bio,
    specialization: data.specialization,
  });

  return {
    message: "Professor profile created successfully",
    data: profile,
  };
};

export const getProfessorProfile = async (userId) => {
  const profile = await Professor.findOne({ user: userId }).populate(
    "user",
    "name email role"
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
