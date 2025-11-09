import express from "express";
import { protect } from "../middleware/auth.js";
import { addCommentController, deleteCommentController } from "../controllers/community/commentController.js";

const router = express.Router();

router.post("/addComment/:postId", protect, addCommentController);
router.delete("/deleteComment/:id", protect, deleteCommentController);

export default router;
