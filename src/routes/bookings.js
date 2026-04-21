import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getBookings, createBooking, deleteBooking } from "../db/bookings.js";
import {
  validateBooking,
  validateBookingResult,
  validateBookingId,
} from "../middleware/bookingValidation.js";

const bookingRouter = Router();

bookingRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

bookingRouter.post(
  "/",
  validateBooking,
  validateBookingResult,
  async (req, res) => {
    const { name, email, quantity, eventId } = req.body;

    try {
      const result = await createBooking({ name, email, quantity, eventId });

      if (result.error === "not_found") {
        return res.status(404).json({ message: "Event not found" });
      }

      if (result.error === "full") {
        return res.status(409).json({ message: "Event is fully booked" });
      }

      return res.status(201).json(result.booking);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
);

bookingRouter.delete(
  "/:id",
  validateBookingId,
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await deleteBooking(id);
      if (!deleted) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }
      return res.status(200).json({
        message: "Booking cancelled",
        booking: deleted,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
);

export default bookingRouter;
