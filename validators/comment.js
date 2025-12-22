import { body, param } from "express-validator";

export const addCommentValidator = [
  param("targetType")
    .isIn(["post", "question"])
    .withMessage("Invalid target type"),

  param("targetId")
    .isMongoId()
    .withMessage("Invalid target id"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required"),
];

export const commentIdParamValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid comment id"),
];
