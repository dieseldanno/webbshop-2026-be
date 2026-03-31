import { Router } from "express";
const eventRouter = Router();
import { getEvents } from "../db/events.js";

eventRouter.get("/", async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

eventRouter.post("/", async (req, res) => {
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
    const event = new Event({
      title,
      description,
      date,
      location,
      maxCapacity,
      price,
      category,
      imageUrl,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ message: "Error creating event" });
  }
});

export default eventRouter;
