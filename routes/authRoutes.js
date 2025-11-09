import express from "express";
import { register, login } from "../controllers/auth/user.js";
import { adminLogin, logout } from "../controllers/auth/admin.js";
import { companyRegister, companyLogin } from "../controllers/auth/company.js";
import { professorRegister, professorLogin } from "../controllers/auth/profisor.js";
import { protect } from "../middleware/auth.js";
import { uploadUserFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register",uploadUserFiles, register);
router.post("/login", login);

router.post("/company/register",uploadUserFiles, companyRegister);
router.post("/company/login", companyLogin);

router.post("/professor/register", professorRegister);
router.post("/professor/login", professorLogin);

router.post("/admin/login", adminLogin);

router.post("/logout", protect, logout);

export default router;
