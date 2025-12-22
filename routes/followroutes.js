import express from "express";
import { sendFollow, unfollowController, getFollowersController, getFollowingController } from "../controllers/follow/follow.js";
import { protect } from "../middleware/auth.js";
import { followUserValidator } from "../validators/follow.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/:targetId/follow", protect, followUserValidator, validateRequest, sendFollow);
router.delete("/:targetId/unfollow", protect, followUserValidator, validateRequest, unfollowController);
router.get("/:userId/following", protect, followUserValidator, validateRequest, getFollowingController);
router.get("/:userId/followers", protect, followUserValidator, validateRequest, getFollowersController);

export default router;
