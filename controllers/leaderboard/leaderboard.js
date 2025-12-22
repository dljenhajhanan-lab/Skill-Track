import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { getProfessorsLeaderboard } from "../../services/leaderboardService.js";

export const getProfessorsLeaderboardController = catchAsync(async (req, res) => {
  const pagination = {
    page: req.query.page,
    limit: req.query.limit,
  };

  const result = await getProfessorsLeaderboard(pagination);
  successResponse(res, result.data, result.message, 200);
});
