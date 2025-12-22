import { body, param } from "express-validator";

export const createCourseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required"),

  body("platform")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Platform cannot be empty"),

  body("link")
    .isURL()
    .withMessage("Invalid course URL"),
];

export const courseIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid course id"),
];
