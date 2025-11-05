import express from "express";
import { approveRequest, rejectRequest, getAllPending } from "../controllers/admin/approvalController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { whitelistApprovalRole } from "../middleware/whitelistRole.js";

const router = express.Router();

router.get("/admin/allrequest", protect, requireAdmin, getAllPending);

router.put("/admin/approve/:role/:id", protect, requireAdmin, whitelistApprovalRole, approveRequest);
router.put("/admin/reject/:role/:id", protect, requireAdmin, whitelistApprovalRole, rejectRequest);

export default router;
