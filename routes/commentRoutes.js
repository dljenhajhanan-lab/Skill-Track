import express from "express";
import { protect } from "../middleware/auth.js";
import { addCommentController, deleteCommentController, markSolutionController, reportCommentController, reactCommentController, unreactCommentController, countCommentReactionsController, listCommentReactionsController } from "../controllers/community/commentController.js";
import { validateRequest } from "../middleware/validateRequest.js";
const router = express.Router();

router.post("/add/:postId", protect,validateRequest ,addCommentController);
router.delete("/delete/:id", protect, deleteCommentController);
router.put("/markSolution/:id", protect,validateRequest, markSolutionController);
router.post("/report/:id", protect,validateRequest, reportCommentController);

router.post("/react/:id", protect,validateRequest, reactCommentController);
router.delete("/unreact/:id", protect, unreactCommentController);
router.get("/reactions/count/:id", protect, countCommentReactionsController);
router.get("/reactions/list/:id", protect, listCommentReactionsController);

export default router;
