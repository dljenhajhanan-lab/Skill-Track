import express from "express";
import { sendFollow,unfollowController,getFollowersController,getFollowingController } from "../controllers/follow/follow.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:targetId/follow", protect, sendFollow);
router.delete("/:targetId/unfollow", protect, unfollowController);
router.get("/:userId/following", protect, getFollowingController);
router.get("/:userId/followers", protect, getFollowersController);

export default router;
