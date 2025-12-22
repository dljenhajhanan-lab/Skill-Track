import express from "express";
import { evaluateStudentCompetenciesController, getMyCompetencyEvaluationsController } from "../controllers/competencyEvaluation/competencyEvaluation.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { competencyValidator } from "../validators/competencyEvaluation.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/", protect, restrictTo("professor"), competencyValidator, validateRequest, evaluateStudentCompetenciesController);
router.get("/me", protect, restrictTo("student"), getMyCompetencyEvaluationsController);

export default router;
