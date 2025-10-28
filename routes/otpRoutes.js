import express from "express";
import { requestReset, verifyAndReset } from "../controllers/auth/otp.js";

const router = express.Router();

router.post("/forgotPassword", requestReset);
router.post("/verifyOTP", verifyAndReset);

export default router;
