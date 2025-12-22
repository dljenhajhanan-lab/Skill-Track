import { body, param } from "express-validator";

export const createBadgeValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Badge title is required"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
];

export const badgeIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid badge id"),
];
