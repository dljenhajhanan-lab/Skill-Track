import express from "express";
import { createCompanyTask,submitCompanyTaskSolution,getAllCompanyTasks,deleteCompanyTask,getCompanyTasks,getCompanyTaskById,getCompanyTaskSubmissions,getStudentTaskSubmissions} from "./companyTask.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/", createCompanyTask);
router.post("/:taskId/submit", submitCompanyTaskSolution);
router.get("/", getAllCompanyTasks);
router.get("/:taskId", getCompanyTaskById);
router.get("/:taskId/submissions", getCompanyTaskSubmissions);
router.get("/student/:studentId/submissions", getStudentTaskSubmissions);
router.delete("/:taskId", deleteCompanyTask);
router.get("/company/my", getCompanyTasks);


export default router;
