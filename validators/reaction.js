import { body, param } from "express-validator";

export const reactionValidator = [
  param("targetType")
    .isIn(["post", "comment", "question"])
    .withMessage("Invalid target type"),

  param("targetId")
    .isMongoId()
    .withMessage("Invalid target id"),

  body("type")
    .isIn(["wise", "loved", "support", "applause", "like", "opps"])
    .withMessage("Invalid reaction type"),
];
