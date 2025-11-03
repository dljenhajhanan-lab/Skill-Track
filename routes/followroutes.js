import express from "express";
import { followController } from "../controllers/follow/follow.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:targetId/follow", protect, followController.createFollow);
router.delete("/:targetId/unfollow", protect, followController.unfollow);
router.get("/:userId/following", protect, followController.getFollowing);
router.get("/:userId/followers", protect, followController.getFollowers);

export default router;
