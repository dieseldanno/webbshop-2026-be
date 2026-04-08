import { Router } from "express";
import Booking from "../models/Booking.js";
// import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
import { createBooking, deleteBooking } from "../db/bookings.js";

const bookingRouter = Router();

// behövs ej
bookingRouter.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("event", "title");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

bookingRouter.post("/", async (req, res) => {
  const { eventId, quantity, name, email } = req.body;

  if (!eventId || !name || !email) {
    return res.status(400).json({
      message: "eventId, name and email is required",
    });
  }

  if (quantity !== undefined && (isNaN(quantity) || quantity < 1)) {
    return res
      .status(400)
      .json({ message: "quantity must be a number greater than 0" });
  }

  // fix for invalid events formats
  if (!mongoose.isValidObjectId(eventId)) {
    return res.status(400).json({ message: "Invalid eventId format" });
  }

  try {
    const result = await createBooking({ eventId, quantity, name, email });

    if (result.error === "not_found") {
      return res.status(404).json({ message: "Event not found" });
    }

    if (result.error === "full") {
      return res.status(409).json({ message: "Event is fully booked" });
    }

    const populatedBooking = await result.booking.populate(
      "event",
      "title date location",
    );
    return res.status(201).json(populatedBooking);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

bookingRouter.delete("/:id", authMiddleware, async (req, res) => {
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
});

export default bookingRouter;
