import express from "express";
import { requestReset, verifyOTP, resetPassword } from "../controllers/auth/otp.js";

const router = express.Router();

router.post("/forgotPassword", requestReset);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);

export default router;
