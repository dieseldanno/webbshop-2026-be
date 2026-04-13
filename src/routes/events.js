import { Router } from "express";
const eventRouter = Router();
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventBookings,
} from "../db/events.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTotalBookedSpots } from "../db/bookings.js";
import {
  handleValidationErrors,
  validateEventBody,
  validateEventUpdate,
  validateId,
} from "../middleware/eventValidation.js";

eventRouter.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const events = await getEvents(filters);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

eventRouter.get("/:id/bookings", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    const getEventWithBookings = await getEventBookings(id);

    if (!getEventWithBookings) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(getEventWithBookings);
  } catch (error) {
    console.error("Error fetching event bookings:", error);
    return res.status(500).json({ message: "Error fetching event bookings" });
  }
});

eventRouter.get("/:id", validateId, async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
});

eventRouter.post("/", authMiddleware, validateEventBody, async (req, res) => {
  try {
    const newEvent = await createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
});

eventRouter.put(
  "/:id",
  authMiddleware,
  validateId,
  validateEventUpdate,
  async (req, res) => {
    try {
      const updateEventById = await updateEvent(req.params.id, req.body);
      if (!updateEventById) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(updateEventById);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event" });
    }
  },
);

eventRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEventById = await deleteEvent(id);

    if (!deleteEventById) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({
      message: `${deleteEventById.title} is deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

export default eventRouter;
