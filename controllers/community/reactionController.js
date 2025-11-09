import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { toggleReaction } from "../../services/reactionService.js";

export const toggleReactionController = catchAsync(async (req, res) => {
  const result = await toggleReaction(req.user, req.body);
  successResponse(res, result, "OK");
});
