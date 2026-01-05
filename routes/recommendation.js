import express from "express";
import { protect } from "../middleware/auth.js";
import { getRecommendations } from "../controllers/recommendation/recommendation.js";

const router = express.Router();
router.get("/:userId", protect, getRecommendations);

export default router;