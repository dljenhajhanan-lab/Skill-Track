import express from "express";
import { protect } from "../middleware/auth.js";
import { attachProfile } from "../middleware/attachProfile.js";
import { createSkill, linkSkillItem, getMySkills } from "../controllers/profile/student/skill.js";
import { createSkillValidator, skillIdValidator } from "../validators/skill.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/skill/create", protect, attachProfile, createSkillValidator, validateRequest, createSkill);
router.post("/skill/link/:skillId", protect, attachProfile, skillIdValidator, validateRequest, linkSkillItem);
router.get("/skill/mySkills", protect, attachProfile, getMySkills);

export default router;
