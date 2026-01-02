import express from "express";
import { protect } from "../middleware/auth.js";
import { attachProfile } from "../middleware/attachProfile.js";
import { getProfileQR,getFullProfileController,getUserProfile,updateUserProfile} from "../controllers/profile/user.js";
import {createProfileItem,deleteProfileItem,deleteSkill,getProfileItems,updateProfileItem} from "../controllers/profile/profileItems.js";
import { getProfessor, updateProfessor } from "../controllers/profile/profissor.js";
import { getCompany, updateCompany } from "../controllers/profile/company.js";
import { uploadAchievementFiles, uploadUserFiles } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, getUserProfile);
router.put("/updateProfile", protect, uploadUserFiles, validateRequest, updateUserProfile);

router.post("/create/:type", protect, attachProfile, uploadAchievementFiles, validateRequest, createProfileItem);
router.get("/get/:type", protect, attachProfile, validateRequest, getProfileItems);
router.put("/update/:type/:id", protect, attachProfile, validateRequest, updateProfileItem);
router.delete("/delete/:type/:id", protect, attachProfile, validateRequest, deleteProfileItem);


router.get("/professor/get", protect, getProfessor);
router.put("/professor/update", protect, uploadUserFiles, validateRequest, updateProfessor);

router.get("/company/get", protect, getCompany);
router.put("/company/update", protect, uploadUserFiles, validateRequest, updateCompany);

router.get("/myProfile/qr", protect, getProfileQR);
router.get('/users/:id', protect, getFullProfileController)

export default router;
