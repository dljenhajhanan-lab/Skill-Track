import express from "express";
import { evaluateStudentCompetenciesController,getMyCompetencyEvaluationsController } from "../controllers/competencyEvaluation/competencyEvaluation.js";
import { protect,restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/",protect,restrictTo("professor"),evaluateStudentCompetenciesController);
router.get("/me",protect,restrictTo("student"),getMyCompetencyEvaluationsController);

export default router;