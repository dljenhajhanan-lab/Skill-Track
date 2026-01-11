import express from "express";
import { register, login, saveFcmToken } from "../controllers/auth/user.js";
import { adminLogin, logout } from "../controllers/auth/admin.js";
import { companyRegister, companyLogin } from "../controllers/auth/company.js";
import { professorRegister, professorLogin } from "../controllers/auth/profisor.js";
import { protect } from "../middleware/auth.js";
import { uploadCompanyFiles, uploadProfessorFiles, uploadUserFiles } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerValidator, loginValidator } from "../validators/auth.js";

const router = express.Router();

router.post("/register", uploadUserFiles, registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);

router.post("/notifications/fcm-token",protect, saveFcmToken);

router.post("/company/register",uploadCompanyFiles, registerValidator, validateRequest, companyRegister);
router.post("/company/login", loginValidator, validateRequest, companyLogin);

router.post("/professor/register",uploadProfessorFiles, registerValidator, validateRequest, professorRegister);
router.post("/professor/login", loginValidator, validateRequest, professorLogin);

router.post("/admin/login", loginValidator, validateRequest, adminLogin);
router.post("/logout", protect, logout);

export default router;
