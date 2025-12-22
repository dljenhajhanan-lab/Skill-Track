import express from "express";
import { requestReset, verifyOTP, resetPassword } from "../controllers/auth/otp.js";
import { sendOtpValidator, verifyOtpValidator } from "../validators/otp.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/forgotPassword", sendOtpValidator, validateRequest, requestReset);
router.post("/verifyOTP", verifyOtpValidator, validateRequest, verifyOTP);
router.post("/resetPassword", validateRequest, resetPassword);

export default router;
