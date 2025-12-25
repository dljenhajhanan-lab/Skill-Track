import express from "express";
import { protect } from "../middleware/auth.js";
import { attachProfile } from "../middleware/attachProfile.js";
import { createSkill, linkSkillItem, getMySkills, getSkillById } from "../controllers/profile/student/skill.js";
import { createSkillValidator } from "../validators/skill.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/skill/create", protect, attachProfile, createSkillValidator, validateRequest, createSkill);
router.post("/skill/link/:skillId", protect, attachProfile, validateRequest, linkSkillItem);
router.get("/skill/mySkills", protect, attachProfile, getMySkills);
router.get("/skill/:skillId",protect,attachProfile,validateRequest,getSkillById);

export default router;
