import Company from "../models/company.js"
import User from "../models/user.js"
import { AppError } from "../utils/appError.js"

export const getCompanyProfile = async (userId) => {
  const company = await Company.findOne({ user: userId })
    .populate("user", "name email role avatar coverImage")

  if (!company) throw new AppError("Profile not found", 404)

  return {
    message: "Profile fetched successfully",
    data: {
      user: company.user,
      companyExtra: company,
    },
  };
}

export const updateCompanyProfile = async (userId, updates, files) => {
  const company = await Company.findOneAndUpdate(
    { user: userId },
    updates,
    { new: true, runValidators: true }
  )

  if (!company) throw new AppError("Profile not found", 404)

  const userUpdates = {}

  if (files?.avatar) {
    userUpdates.avatar = files.avatar[0].path.replace(/\\/g, "/")
  }

  if (files?.coverImage) {
    userUpdates.coverImage = files.coverImage[0].path.replace(/\\/g, "/")
  }

  if (Object.keys(userUpdates).length) {
    await User.findByIdAndUpdate(userId, userUpdates)
  }

  const user = await User.findById(userId)
    .select("name email role avatar coverImage")

  return {
    message: "Professor profile updated successfully",
    data: {
      profile: {
        user,
        fullName: company.companyName,
      },
      companyExtra: {
        _id: company._id,
        companyName: company.companyName,
        bio: company.bio,
        approvalStatus: company.approvalStatus,
      },
    }
  }
}
