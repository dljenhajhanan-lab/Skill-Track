import Badge from "../../../models/badge.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { successResponse } from "../../../utils/responseHandler.js";
import { AppError } from "../../../utils/appError.js";

export const getMyBadges = catchAsync(async (req, res) => {
  const badges = await Badge.find({ profile: req.profileId }).populate({
      path: "skill",
      select: "name level",
      populate: [
        {
          path: "linkedProjects",
          select: "title description",
        },
        {
          path: "linkedAchievements",
          select: "title description",
        },
        {
          path: "linkedCertificates",
          select: "title",
        },
      ],
    });;
  successResponse(res, badges, "Badges fetched successfully", 200);
});

export const getBadgeById = catchAsync(async (req, res) => {
  const badge = await Badge.findById(req.params.id).populate({
      path: "skill",
      select: "name level",
      populate: [
        {
          path: "linkedProjects",
          select: "title description",
        },
        {
          path: "linkedAchievements",
          select: "title description",
        },
        {
          path: "linkedCertificates",
          select: "title",
        },
      ],
    });
  if (!badge) throw new AppError("Badge not found", 404);
  successResponse(res, badge, "Badge fetched successfully", 200);
});

export const deleteBadge = catchAsync(async (req, res) => {
  const badge = await Badge.findByIdAndDelete(req.params.id);
  if (!badge) throw new AppError("Badge not found", 404);
  successResponse(res, null, "Badge deleted successfully", 200);
});
