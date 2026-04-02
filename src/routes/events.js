import { Router } from "express";
const eventsRouter = Router();
import { getEvents, createEvent } from "../db/events.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

eventsRouter.get("/", async (req, res) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

eventsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      maxCapacity,
      price,
      category,
      imageUrl,
    } = req.body;
    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !maxCapacity ||
      !price ||
      !category
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newEvent = await createEvent({
      title,
      description,
      date,
      location,
      maxCapacity,
      price,
      category,
      imageUrl,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ message: "Error creating event" });
  }
});

export default eventsRouter;
