import express from "express";
import { protect } from "../middleware/auth.js";
import { addReactionController, removeReactionController, countReactionsController, listReactionsController} from "../controllers/community/reactionController.js";
import { validateRequest } from "../middleware/validateRequest.js";
const router = express.Router();

router.post("add/:targetType/:targetId", protect,validateRequest, addReactionController);
router.delete("delete/:targetType/:targetId", protect, removeReactionController);
router.get("/count/:targetType/:targetId", protect, countReactionsController);
router.get("/list/:targetType/:targetId", protect, listReactionsController);

export default router;
