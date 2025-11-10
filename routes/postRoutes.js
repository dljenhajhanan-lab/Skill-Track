import express from "express";
import { protect } from "../middleware/auth.js";
import { createPostController, getAllPostsController, getPostByIdController, updatePostController, deletePostController } from "../controllers/community/postController.js";

const router = express.Router();

router.post("/create", protect, createPostController);
router.get("/getPosts", protect, getAllPostsController);
router.get("/getPostDetail/:id", protect, getPostByIdController);
router.put("/updatePost/:id", protect, updatePostController);
router.delete("/deletePost/:id", protect, deletePostController);

export default router;
