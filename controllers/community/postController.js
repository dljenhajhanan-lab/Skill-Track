import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createPost, getVisiblePosts, getPostById, updatePost, deletePost } from "../../services/postService.js";

export const getAllPostsController = catchAsync(async (req, res) => {
  const posts = await getVisiblePosts(req.user);
  successResponse(res, posts, "Visible posts fetched");
});

export const createPostController = catchAsync(async (req, res) => {
  const post = await createPost(req.user, req);
  successResponse(res, post, "Post created", 201);
});

export const getPostByIdController = catchAsync(async (req, res) => {
  const post = await getPostById(req.params.id);
  successResponse(res, post, "Post fetched");
});

export const updatePostController = catchAsync(async (req, res) => {
  const post = await updatePost(req.user, req.params.id, req.body);
  successResponse(res, post, "Post updated");
});

export const deletePostController = catchAsync(async (req, res) => {
  await deletePost(req.user, req.params.id);
  successResponse(res, null, "Post deleted");
});