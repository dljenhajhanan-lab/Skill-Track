import express from "express";
import {
  approveRequest,
  rejectRequest,
  getAllPending,
} from "../controllers/admin/approvalController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin/pending", protect, requireAdmin, getAllPending);
router.put("/admin/approve/:role/:id", protect, requireAdmin, approveRequest);
router.put("/admin/reject/:role/:id", protect, requireAdmin, rejectRequest);

export default router;
