import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { addComment, deleteComment, markSolution, reportComment } from "../../services/commentService.js";
import { addOrUpdateReaction, removeReaction, countReactions, getReactionsByTarget } from "../../services/reactionService.js";

export const addCommentController = catchAsync(async (req, res) => {
  const comment = await addComment(req.user, req.params.postId, req.body);
  successResponse(res, comment, "Comment added", 201);
});

export const deleteCommentController = catchAsync(async (req, res) => {
  await deleteComment(req.user, req.params.id);
  successResponse(res, null, "Comment deleted");
});

export const markSolutionController = catchAsync(async (req, res) => {
  const result = await markSolution(req.user, req.params.id, req.body.checked);
  successResponse(res, result, "Solution marked");
});

export const reportCommentController = catchAsync(async (req, res) => {
  const result = await reportComment(req.user, req.params.id, req.body.reason);
  successResponse(res, result, "Reported");
});

export const reactCommentController = catchAsync(async (req, res) => {
  const reaction = await addOrUpdateReaction(req.user, "comment", req.params.id, req.body.type);
  successResponse(res, reaction, "Reaction updated");
});

export const unreactCommentController = catchAsync(async (req, res) => {
  await removeReaction(req.user, "comment", req.params.id);
  successResponse(res, null, "Reaction removed");
});

export const countCommentReactionsController = catchAsync(async (req, res) => {
  const count = await countReactions("comment", req.params.id);
  successResponse(res, { count }, "Count fetched");
});

export const listCommentReactionsController = catchAsync(async (req, res) => {
  const reactions = await getReactionsByTarget("comment", req.params.id);
  successResponse(res, reactions, "List fetched");
});
