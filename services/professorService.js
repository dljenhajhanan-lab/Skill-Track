import Professor from "../models/professor.js";
import User from "../models/user.js";
import { AppError } from "../utils/appError.js";

export const getProfessorProfile = async (userId) => {
  const profile = await Professor.findOne({ user: userId })
    .populate("user", "name email role avatar coverImage");

  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile fetched successfully",
    data: {
      user: profile.user,
      professorExtra: profile,
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

  if (Object.keys(userUpdates).length) {
    await User.findByIdAndUpdate(userId, userUpdates, { new: true });
  }

  const user = await User.findById(userId)
    .select("name email role avatar coverImage");

    return {
    message: "Professor profile updated successfully",
    data: {
      profile: {
        user,
        fullName: user.name,
      },
      professorExtra: {
        _id: profile._id,
        bio: profile.bio,
        specialization: profile.specialization,
        certificate: profile.certificate,
        approvalStatus: profile.approvalStatus,
      },
    },
  };
};

