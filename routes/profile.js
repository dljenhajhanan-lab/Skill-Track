import express from "express";
import { protect } from "../middleware/auth.js";
import { createUserProfile, getUserProfile, updateUserProfile } from "../controllers/profile/user.js";
import { createProfileItem, deleteProfileItem, getProfileItems, updateProfileItem } from "../controllers/profile/profileItems.js";
import { createProfessor, getProfessor,updateProfessor,} from "../controllers/profile/profissor.js";
import { createCompany, getCompany, updateCompany } from "../controllers/profile/company.js";


const router = express.Router();

router.post("/createProfile", protect, createUserProfile);
router.get("/Profile", protect, getUserProfile);
router.put("/updateProfile", protect, updateUserProfile);

router.post("/create/:type", protect, createProfileItem);
router.get("/get/:type", protect, getProfileItems);
router.delete("/delete/:type/:id", protect, deleteProfileItem);
router.put("/update/:type/:id", protect, updateProfileItem);

router.post("/professor/create", protect, createProfessor);
router.get("/professor/get", protect, getProfessor);
router.put("/professor/update", protect, updateProfessor);


router.post("/company/create", protect, createCompany);
router.get("/company/get", protect, getCompany);
router.put("/company/update", protect, updateCompany);


export default router;
