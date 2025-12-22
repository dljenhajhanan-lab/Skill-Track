import express from "express";
import { approveRequest, rejectRequest, getAllPending } from "../controllers/admin/approvalController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { whitelistApprovalRole } from "../middleware/whitelistRole.js";
import { approvalValidator } from "../validators/approval.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/admin/allrequest", protect, requireAdmin, getAllPending);
router.put("/admin/approve/:role/:id", protect, requireAdmin, approvalValidator, validateRequest, whitelistApprovalRole, approveRequest);
router.put("/admin/reject/:role/:id", protect, requireAdmin, approvalValidator, validateRequest, whitelistApprovalRole, rejectRequest);

export default router;
