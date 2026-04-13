//TODO: Här ska jag lägga valideringar för events
import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateEventBody = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("location")
    .notEmpty()
    .withMessage("Location is required, Stockholm, Uppsala, Göteborg or Malmö"),
  body("maxCapacity")
    .isInt({ min: 1 })
    .withMessage("Max capacity must be an integer greater than 0"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category")
    .notEmpty()
    .withMessage(
      "Category is required, Music, Sports, Art & culture, Health, Dance or Social activities",
    ),
  body("imageUrl")
    .notEmpty()
    .withMessage("Image is required and must be a valid URL")
    .isURL()
    .withMessage("Image must be a valid URL"),
  handleValidationErrors,
];
