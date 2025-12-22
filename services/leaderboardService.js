import ProfessorActivity from "../models/ProfessorActivity.js";
import { normalizePagination } from "../utils/paginate.js"

export const getProfessorsLeaderboard = async (pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const total = await ProfessorActivity.countDocuments();

  const leaderboard = await ProfessorActivity.find()
    .sort({ totalPoints: -1 })
    .skip(skip)
    .limit(limit)
    .populate("professor", "name avatar");

  return {
    data: leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
