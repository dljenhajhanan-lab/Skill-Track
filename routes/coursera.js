import express from "express";
import { body } from "express-validator";
import { verifyCoursera, getMyCourseraCertificates } from "../controllers/integrations/coursera.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/verify",protect,requireRole("student"),
  body("shareUrl").isURL().withMessage("Valid Coursera URL required"),
  validateRequest,
  verifyCoursera
);

router.get("/my-certificates", protect, requireRole("student"), getMyCourseraCertificates);

export default router;
