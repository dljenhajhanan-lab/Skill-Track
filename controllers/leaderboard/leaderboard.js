import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { getProfessorsLeaderboard } from "../../services/leaderboardService.js";

export const getProfessorsLeaderboardController = catchAsync(
  async (req, res) => {
    const result = await getProfessorsLeaderboard();
    successResponse(res, result.data, result.message, 200);
  }
);
