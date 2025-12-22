import express from "express";
import { createCompanyTask, submitCompanyTaskSolution, getAllCompanyTasks, deleteCompanyTask, getCompanyTasks, getCompanyTaskById, getCompanyTaskSubmissions,getTaskSubmissions} from "../controllers/task/companyTask.js";
import { protect } from "../middleware/auth.js";
import { createTaskValidator, taskIdValidator, studentIdValidator } from "../validators/task.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();
router.use(protect);

router.post("/", createTaskValidator, validateRequest, createCompanyTask);
router.post("/:taskId/submit", taskIdValidator, validateRequest, submitCompanyTaskSolution);
router.get("/", getAllCompanyTasks);
router.get("/:taskId", taskIdValidator, validateRequest, getCompanyTaskById);
router.get("/:taskId/submissions", taskIdValidator, validateRequest, getCompanyTaskSubmissions);
router.get("/student/:studentId/submissions", studentIdValidator, validateRequest, getTaskSubmissions);
router.delete("/:taskId", taskIdValidator, validateRequest, deleteCompanyTask);
router.get("/company/my", getCompanyTasks);

export default router;
