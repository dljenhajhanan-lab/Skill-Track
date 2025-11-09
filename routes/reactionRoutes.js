import express from "express";
import { protect } from "../middleware/auth.js";
import { toggleReactionController } from "../controllers/community/reactionController.js";

const router = express.Router();

router.post("/addReaction", protect, toggleReactionController);

export default router;
