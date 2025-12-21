import express from "express";
import { createCompanyTask,submitCompanyTaskSolution,getAllCompanyTasks,deleteCompanyTask,getCompanyTasks,getCompanyTaskById,getCompanyTaskSubmissions,getTaskSubmissions} from "../controllers/task/companyTask.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.post("/", createCompanyTask);
router.post("/:taskId/submit", submitCompanyTaskSolution);
router.get("/", getAllCompanyTasks);
router.get("/:taskId", getCompanyTaskById);
router.get("/:taskId/submissions", getCompanyTaskSubmissions);
router.get("/student/:studentId/submissions", getTaskSubmissions);
router.delete("/:taskId", deleteCompanyTask);
router.get("/company/my", getCompanyTasks);


export default router;