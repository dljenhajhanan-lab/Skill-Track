import express from "express";
import { protect } from "../middleware/auth.js";
import { createQuestionController, listQuestionsController, getQuestionDetailsController } from "../controllers/community/questionController.js";

const router = express.Router();

router.post("/createPost", protect, createQuestionController);
router.get("/getPosts", protect, listQuestionsController);
router.get("/getPostDetail/:id", protect, getQuestionDetailsController);

export default router;
