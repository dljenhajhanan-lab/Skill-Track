import { body, param } from "express-validator";

export const profileItemTypeValidator = [
  param("type")
    .isIn(["Skill", "Project", "Achievement", "Badge", "CourseLink"])
    .withMessage("Invalid profile item type"),
];


export const createProfileItemValidator = [
  ...profileItemTypeValidator,

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("github")
    .optional()
    .isURL()
    .withMessage("Invalid GitHub URL"),

  body("link")
    .optional()
    .isURL()
    .withMessage("Invalid link"),
];

export const updateProfileItemValidator = [
  ...profileItemTypeValidator,
  body("title").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("github").optional().isURL(),
  body("link").optional().isURL(),
];
