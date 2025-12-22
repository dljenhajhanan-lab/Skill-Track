import { body, param } from "express-validator";

export const postIdParamValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid post id"),
];

export const createPostValidator = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),

  body("linkUrl")
    .optional()
    .isURL()
    .withMessage("Invalid URL"),
];

export const updatePostValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid post id"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),

  body("linkUrl")
    .optional()
    .isURL()
    .withMessage("Invalid URL"),
];
