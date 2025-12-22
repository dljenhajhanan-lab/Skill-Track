import { param } from "express-validator";

export const followUserValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user id"),
];
