import express from "express";
import { evaluateStudentCompetenciesController, getStudentEvaluationsController } from "../controllers/competencyEvaluation/competencyEvaluation.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { evaluateCompetencyValidator } from "../validators/competencyEvaluation.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { evaluateMyProfile } from "../controllers/profile/student/aiEvaluationController.js";

const router = express.Router();

router.post("/", protect, restrictTo("professor"), evaluateCompetencyValidator, validateRequest, evaluateStudentCompetenciesController);
router.get("/student/:studentId", protect, getStudentEvaluationsController);
router.get("/ai/evaluate-profile",protect,evaluateMyProfile);

export default router;