import express from "express";
import { protect } from "../middleware/auth.js";
import { addCommentController, deleteCommentController, markSolutionController, reportCommentController, unreactCommentController} from "../controllers/community/commentController.js";
import { addCommentValidator, commentIdParamValidator } from "../validators/comment.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reactionValidator } from "../validators/reaction.js"

const router = express.Router();

router.post("/add/:targetType/:targetId", protect, addCommentValidator, validateRequest, addCommentController);
router.delete("/delete/:id", protect, commentIdParamValidator, validateRequest, deleteCommentController);
router.put("/markSolution/:id", protect, commentIdParamValidator, validateRequest, markSolutionController);
router.post("/report/:id", protect, commentIdParamValidator, validateRequest, reportCommentController);
router.delete("/unreact/:id", protect, commentIdParamValidator, validateRequest, unreactCommentController);

router.get("/reactions/count/:id", protect, commentIdParamValidator, validateRequest, reactionValidator);
router.get("/reactions/list/:id", protect, commentIdParamValidator, validateRequest, reactionValidator);

export default router;
