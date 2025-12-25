import { body, param } from "express-validator";

export const updateProfileValidator = [
  body("fullName")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Full name must be a valid string"),

  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters"),

  body("university")
    .optional()
    .isString()
    .trim()
    .withMessage("University must be a string"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("address")
    .optional()
    .isString()
    .trim()
    .withMessage("Address must be a string"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender must be male or female"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
];

export const profileTypeValidator = [
  param("type")
    .isIn(["Skill", "Project", "Achievement", "Badge", "CourseLink"])
    .withMessage("Invalid profile item type"),
];

export const profileItemIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid item id"),
];
