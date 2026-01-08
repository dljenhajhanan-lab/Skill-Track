import express from "express";
import { sendFollow, unfollowController, getFollowersController, getFollowingController, checkFollowStatusController } from "../controllers/follow/follow.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/:targetId/follow", protect, validateRequest, sendFollow);
router.delete("/:targetId/unfollow", protect, validateRequest, unfollowController);
router.get("/:userId/following", protect, validateRequest, getFollowingController);
router.get("/:userId/followers", protect, validateRequest, getFollowersController);
router.get("/check/:targetId",protect,checkFollowStatusController);

export default router;
