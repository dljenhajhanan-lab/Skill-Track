import { AppError } from "../utils/appError.js";

const ALLOWED_APPROVAL_ROLES = new Set(["company", "professor"]);

export const whitelistApprovalRole = (req, res, next) => {
  const { role } = req.params;
  if (!ALLOWED_APPROVAL_ROLES.has(role)) {
    return next(new AppError("Invalid role", 400));
  }
  next();
};
