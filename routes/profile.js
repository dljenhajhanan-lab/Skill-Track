import express from "express";
import { protect } from "../middleware/auth.js";
import { createUserProfile, getUserProfile, updateUserProfile } from "../controllers/profile/user.js";
import { createProfileItem, deleteProfileItem, getProfileItems, updateProfileItem } from "../controllers/profile/profileItems.js";

const router = express.Router();

router.post("/createProfile", protect, createUserProfile);
router.get("/Profile", protect, getUserProfile);
router.put("/updateProfile", protect, updateUserProfile);

router.post("/create/:type", protect, createProfileItem);
router.get("/get/:type", protect, getProfileItems);
router.delete("/delete/:type/:id", protect, deleteProfileItem);
router.put("/update/:type/:id", protect, updateProfileItem);

export default router;
