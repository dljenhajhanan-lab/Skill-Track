import { getLeaderboard } from "../../services/StudentLeaderboard.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";

export const getLeaderboardController = catchAsync(async (req, res) => {
  const leaderboard = await getLeaderboard();
  successResponse(res, leaderboard, "Leaderboard fetched successfully", 200);
});
