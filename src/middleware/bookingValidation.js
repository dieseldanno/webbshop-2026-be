import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

export const validateBooking = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("eventId")
    .notEmpty()
    .withMessage("Event is required")
    .isMongoId()
    .withMessage("Invalid eventId format"),
];

export const validateBookingResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateBookingId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};
