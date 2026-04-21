import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const validateAuthResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
