import { body } from "express-validator";

export const sendOtpValidator = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),
];

export const verifyOtpValidator = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("otp")
    .isLength({ min: 4, max: 6 })
    .withMessage("Invalid OTP"),
];
