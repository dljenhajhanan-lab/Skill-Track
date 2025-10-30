import express from "express";
import { protect } from "../middleware/auth.js";
import { getUserProfile, updateUserProfile } from "../controllers/profile/user.js";
import { createProfileItem, deleteProfileItem, getProfileItems, updateProfileItem} from "../controllers/profile/profileItems.js";
import { getProfessor,updateProfessor,} from "../controllers/profile/profissor.js";
import { getCompany, updateCompany } from "../controllers/profile/company.js";
import { attachProfile } from "../middleware/attachProfile.js";

const router = express.Router();

router.get("/Profile", protect, getUserProfile);
router.put("/updateProfile", protect, updateUserProfile);

router.post("/create/:type", protect, attachProfile, createProfileItem);
router.get("/get/:type", protect, attachProfile, getProfileItems);
router.delete("/delete/:type/:id", protect, attachProfile, deleteProfileItem);
router.put("/update/:type/:id", protect, attachProfile, updateProfileItem);

router.get("/professor/get", protect, getProfessor);
router.put("/professor/update", protect, updateProfessor);

router.get("/company/get", protect, getCompany);
router.put("/company/update", protect, updateCompany);


export default router;
