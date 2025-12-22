import express from "express";
import { protect } from "../middleware/auth.js";
import { createQuestionController,listQuestionsController,getQuestionDetailsController,deleteQuestionController} from "../controllers/community/questionController.js";
import { uploadQuestionFiles } from "../middleware/uploadMiddleware.js";
import { createQuestionValidator, questionIdValidator } from "../validators/question.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/create", protect, uploadQuestionFiles, createQuestionValidator, validateRequest, createQuestionController);
router.get("/list", protect, listQuestionsController);
router.get("/detail/:id", protect, questionIdValidator, validateRequest, getQuestionDetailsController);
router.delete("/delete/:id", protect, questionIdValidator, validateRequest, deleteQuestionController);

export default router;
