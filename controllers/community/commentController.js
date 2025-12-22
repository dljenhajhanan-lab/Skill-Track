import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { addComment, deleteComment, getCommentsByTarget, markSolution, reportComment, getChildComments  } from "../../services/commentService.js";
import { removeReaction, countReactions, getReactionsByTarget } from "../../services/reactionService.js";

export const addCommentController = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params
  const comment = await addComment(req.user, targetType, targetId, req.body);
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

export const getCommentsByTargetController = catchAsync(async (req, res) => {
  const { targetType, targetId } = req.params;
  const pagination = {page: req.query.page,limit: req.query.limit,};
  const result = await getCommentsByTarget(targetType,targetId,pagination);

  successResponse(res, result, "Comments fetched successfully");
});

export const getChildCommentsController = catchAsync(async (req, res) => {
  const pagination = {page: req.query.page,limit: req.query.limit,};
  const result = await getChildComments(req.params.commentId,pagination);
  successResponse(res, result, "Replies fetched successfully");
});
