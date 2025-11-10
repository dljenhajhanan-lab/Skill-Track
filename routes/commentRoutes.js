import express from "express";
import { protect } from "../middleware/auth.js";
import { addCommentController, deleteCommentController, markSolutionController, reportCommentController, reactCommentController, unreactCommentController, countCommentReactionsController, listCommentReactionsController } from "../controllers/community/commentController.js";

const router = express.Router();

router.post("/add/:postId", protect, addCommentController);
router.delete("/delete/:id", protect, deleteCommentController);
router.patch("/markSolution/:id", protect, markSolutionController);
router.post("/report/:id", protect, reportCommentController);

router.post("/react/:id", protect, reactCommentController);
router.delete("/unreact/:id", protect, unreactCommentController);
router.get("/reactions/count/:id", protect, countCommentReactionsController);
router.get("/reactions/list/:id", protect, listCommentReactionsController);

export default router;
