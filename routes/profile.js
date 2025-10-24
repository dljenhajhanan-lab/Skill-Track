import express from "express";
import { protect } from "../middleware/auth.js";
import { createUserProfile, getUserProfile, updateUserProfile } from "../controllers/profile/user.js";

const router = express.Router();

router.post("/createProfile", protect, createUserProfile);
router.get("/Profile", protect, getUserProfile);
router.patch("/updateProfile", protect, updateUserProfile);

export default router;
