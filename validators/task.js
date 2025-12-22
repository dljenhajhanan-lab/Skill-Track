import { body, param } from "express-validator";

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required"),

  body("description")
    .optional()
    .trim()
    .notEmpty(),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date"),
];

export const updateTaskValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task id"),

  body("title").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Invalid status"),
];
