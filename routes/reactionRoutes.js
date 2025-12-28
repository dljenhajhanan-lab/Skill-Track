import express from "express";
import { protect } from "../middleware/auth.js";
import { addReactionController,removeReactionController,countReactionsController,listReactionsController} from "../controllers/community/reactionController.js";
import { reactionValidator } from "../validators/reaction.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/add/:targetType/:targetId", protect, reactionValidator, validateRequest, addReactionController);
router.delete("/delete/:targetType/:targetId", protect, reactionValidator, validateRequest, removeReactionController);
router.get("/count/:targetType/:targetId", protect, reactionValidator, validateRequest, countReactionsController);
router.get("/list/:targetType/:targetId", protect, validateRequest, listReactionsController);

export default router;
