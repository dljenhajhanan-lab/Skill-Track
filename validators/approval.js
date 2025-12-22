import { param } from "express-validator";

export const approvalValidator = [
  param("role")
    .isIn(["student", "professor", "company"])
    .withMessage("Invalid role"),

  param("id")
    .isMongoId()
    .withMessage("Invalid user id"),
];
