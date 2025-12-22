import { body, param } from "express-validator";

export const createQuestionValidator = [
  body("title").notEmpty(),
  body("content").notEmpty(),
];

export const questionIdValidator = [
  param("id").isMongoId(),
];
