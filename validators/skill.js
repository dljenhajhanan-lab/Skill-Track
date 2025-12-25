import { body, param } from "express-validator";

export const createSkillValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Skill name is required"),

  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Skill level must be one of: beginner, intermediate, advanced')
];

export const skillIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid skill id"),
];
