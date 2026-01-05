import User from "../models/user.js";
import Profile from "../models/profile.js";
import Professor from "../models/professor.js";
import Follow from "../models/follow.js";
import { AppError } from "../utils/appError.js";
import { normalizePagination } from "../utils/paginate.js";

export const getRecommendedUsers = async (userId, pagination = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const { page, limit, skip } = normalizePagination(pagination);

  const followed = await Follow.find({ follower: userId }).select("following");
  const excludedIds = followed.map(f => f.following.toString());
  excludedIds.push(userId.toString());

  if (user.role === "student") {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) throw new AppError("Profile not found", 404);

    const candidates = await Profile.find({
      user: { $nin: excludedIds },
      $or: [
        { university: profile.university },
        { postion: profile.postion },
      ],
    })
      .populate("user", "name avatar role email");

    const ranked = candidates.map(p => {
      let score = 0;
      if (p.university === profile.university) score += 2;
      if (p.postion === profile.postion) score += 1;

      return { score, user: p.user };
    });

    ranked.sort((a, b) => b.score - a.score);

    const paginated = ranked.slice(skip, skip + limit);

    return {
      data: paginated.map(r => r.user),
      pagination: {
        page,
        limit,
        total: ranked.length,
        totalPages: Math.ceil(ranked.length / limit),
      },
    };
  }

  if (user.role === "professor") {
    const professor = await Professor.findOne({ user: userId });
    if (!professor) throw new AppError("Professor profile not found", 404);

    const total = await Professor.countDocuments({
      user: { $nin: excludedIds },
      specialization: professor.specialization,
    });

    const professors = await Professor.find({
      user: { $nin: excludedIds },
      specialization: professor.specialization,
    })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar role email");

    return {
      data: professors.map(p => p.user),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  throw new AppError("Role not supported", 400);
};
