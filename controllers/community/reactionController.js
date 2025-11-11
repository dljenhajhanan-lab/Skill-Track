import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { addOrUpdateReaction, removeReaction, countReactions, getReactionsByTarget } from "../../services/reactionService.js";

export const addReactionController = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const { type } = req.body;
  const reaction = await addOrUpdateReaction(req.user, targetType, targetId, type);
  successResponse(res, reaction, "Reaction added/updated", 201);
});

export const removeReactionController = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  await removeReaction(req.user, targetType, targetId);
  successResponse(res, null, "Reaction removed");
});

export const countReactionsController = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const count = await countReactions(targetType, targetId);
  successResponse(res, { count }, "Count fetched");
});

export const listReactionsController = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const reactions = await getReactionsByTarget(targetType, targetId);
  successResponse(res, reactions, "List fetched");
});
