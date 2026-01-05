import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { getRecommendedUsers } from "../../services/recommendationService.js";

export const getRecommendations = catchAsync(async (req, res) => {
  const pagination = {page: req.query.page,limit: req.query.limit,};
  const result = await getRecommendedUsers(req.params.userId, pagination);
  successResponse(res, result, "Recommendations fetched successfully");
});

