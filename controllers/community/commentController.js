import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { addComment, deleteComment } from "../../services/commentService.js";

export const addCommentController = catchAsync(async (req, res) => {
  const c = await addComment(req.user, req.params.postId, req.body);
  successResponse(res, c, "Added", 201);
});

export const deleteCommentController = catchAsync(async (req, res) => {
  await deleteComment(req.user, req.params.id);
  successResponse(res, null, "Deleted");
});
