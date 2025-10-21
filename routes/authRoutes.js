import express from "express";
import { register, login } from "../controllers/auth/user.js";
import { adminLogin } from "../controllers/auth/admin.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/admin/login", adminLogin);

export default router;
