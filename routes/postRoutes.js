import express from "express";
import { protect } from "../middleware/auth.js";
import { createPostController, getAllPostsController, getPostByIdController, updatePostController, deletePostController} from "../controllers/community/postController.js";
import { uploadPostFiles } from "../middleware/uploadMiddleware.js";
import { createPostValidator, updatePostValidator, postIdParamValidator } from "../validators/post.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/create", protect, uploadPostFiles, createPostValidator, validateRequest, createPostController);
router.get("/getPosts", protect, getAllPostsController);
router.get("/getPostDetail/:id", protect, postIdParamValidator, validateRequest, getPostByIdController);
router.put("/updatePost/:id", protect, updatePostValidator, validateRequest, updatePostController);
router.delete("/deletePost/:id", protect, postIdParamValidator, validateRequest, deletePostController);

export default router;
