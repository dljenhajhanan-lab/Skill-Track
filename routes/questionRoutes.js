import express from "express";
import { protect } from "../middleware/auth.js";
import { createQuestionController, listQuestionsController, getQuestionDetailsController, deleteQuestionController } from "../controllers/community/questionController.js";
import { uploadQuestionFiles } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/create", protect, validateRequest, uploadQuestionFiles, createQuestionController);
router.get("/list", protect, listQuestionsController);
router.get("/detail/:id", protect, getQuestionDetailsController);
router.delete("/delete/:id", protect, deleteQuestionController);

export default router;
