import { Router } from "express";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

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
  const { eventId, name, email } = req.body;

  if (!eventId || !name || !email) {
    return res.status(400).json({
      message: "eventId, name and email is required",
    });
  }

  try {
    // fix for invalid events formats
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid eventId format" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    const bookingCount = await Booking.countDocuments({ event: eventId });

    if (bookingCount >= event.maxCapacity) {
      return res.status(409).json({
        message: "Event is fully booked",
      });
    }
    const newBooking = new Booking({
      event: eventId,
      name,
      email,
    });

    const savedBooking = await newBooking.save();
    const populatedBooking = await savedBooking.populate(
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
    // fix for invalid eventis formats
    // if (!mongoose.isValidObjectId(eventId)) {
    //   return res.status(400).json({ message: "Invalid eventId format" });
    // }

    const deleted = await Booking.findByIdAndDelete(id);
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
