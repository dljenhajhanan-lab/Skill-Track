import express from "express";
import { protect } from "../middleware/auth.js";
import { attachProfile } from "../middleware/attachProfile.js";
import { createSkill, linkSkillItem, getMySkills, } from "../controllers/profile/student/skill.js";

const router = express.Router();

router.post("/skill/create", protect, attachProfile, createSkill);
router.post("/skill/link/:skillId", protect, attachProfile, linkSkillItem);
router.get("/skill/mySkills", protect, attachProfile, getMySkills);

export default router;
