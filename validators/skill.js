import { body, param } from "express-validator";

export const createSkillValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Skill name is required"),

  body("level")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Skill level must be between 1 and 5"),
];

export const skillIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid skill id"),
];
