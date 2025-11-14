import express from "express";
import { protect } from "../middleware/auth.js";
import { createPostController, getAllPostsController, getPostByIdController, updatePostController, deletePostController } from "../controllers/community/postController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { uploadPostFiles } from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/create", protect,validateRequest,uploadPostFiles, createPostController);
router.get("/getPosts", protect, getAllPostsController);
router.get("/getPostDetail/:id", protect, getPostByIdController);
router.put("/updatePost/:id", protect,validateRequest, updatePostController);
router.delete("/deletePost/:id", protect, deletePostController);

export default router;
