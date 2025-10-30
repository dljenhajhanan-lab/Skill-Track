import { AppError } from "../utils/appError.js";

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Access denied", 403));
  }
  next();
};
