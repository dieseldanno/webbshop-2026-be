import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Event not found" });
    }
    next();
}

export const validateEventBody = [
  body("title").isString().withMessage("Title is required"),
  body("description").isString().withMessage("Description is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("location")
    .isString()
    .withMessage("Location must be a string")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isIn(["Stockholm", "Uppsala", "Göteborg", "Malmö"])
    .withMessage("Invalid location selected"),
  body("maxCapacity")
    .isInt({ min: 1 })
    .withMessage("Max capacity must be an integer greater than 0"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category")
    .isString()
    .withMessage("Category must be a string")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Music",
      "Sports",
      "Art & culture",
      "Health",
      "Dance",
      "Social activities",
    ])
    .withMessage("Invalid category selected"),
  body("imageUrl").isURL().withMessage("Image must be a valid URL"),
  handleValidationErrors,
];

export const validateEventUpdate = [
    body("title").optional().isString().withMessage("Title must be a string"),
    body("description").optional().isString().withMessage("Description must be a string"),
    body("date").optional().isISO8601().withMessage("Date must be a valid ISO 8601 date"),
    body("location")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Location cannot be empty")
      .isIn(["Stockholm", "Uppsala", "Göteborg", "Malmö"])
      .withMessage("Invalid location selected"),
    body("maxCapacity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Max capacity must be an integer greater than 0"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("category")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Category cannot be empty")
      .isIn([
        "Music",
        "Sports",
        "Art & culture",
        "Health",
        "Dance",
        "Social activities",
      ])
      .withMessage("Invalid category selected"),
    body("imageUrl").optional().isURL().withMessage("Image must be a valid URL"),
    handleValidationErrors,
]
