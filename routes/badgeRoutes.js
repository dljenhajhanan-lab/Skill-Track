import express from "express";
import { protect } from "../middleware/auth.js";
import { attachProfile } from "../middleware/attachProfile.js";
import { getMyBadges, getBadgeById, deleteBadge } from "../controllers/profile/student/badgeController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/myBadges", protect, attachProfile, getMyBadges);
router.get("/Badge/:id", protect, attachProfile, getBadgeById);

router.delete("/deleteBadge/:id", protect, requireAdmin, deleteBadge);

export default router;
