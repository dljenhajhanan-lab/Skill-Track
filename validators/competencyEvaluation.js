import { body } from "express-validator";

export const evaluateCompetencyValidator = [
  body("student")
    .isMongoId()
    .withMessage("Invalid student id"),

  body("competencies.practicalCompetency")
    .isInt({ min: 0, max: 10 })
    .withMessage("practicalCompetency must be 0–10"),

  body("competencies.problemSolving")
    .isInt({ min: 0, max: 10 })
    .withMessage("problemSolving must be 0–10"),

  body("competencies.analyticalThinking")
    .isInt({ min: 0, max: 10 })
    .withMessage("analyticalThinking must be 0–10"),

  body("competencies.communicationDocumentation")
    .isInt({ min: 0, max: 10 })
    .withMessage("communicationDocumentation must be 0–10"),

  body("overallComment")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Comment too long"),
];
