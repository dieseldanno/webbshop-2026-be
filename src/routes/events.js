import { Router } from "express";
const eventRouter = Router();
import { getEvents, getEventById, createEvent } from "../db/events.js";

eventRouter.get("/", async (req, res) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

eventRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const event = await getEventById(id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }
    res.status(200).json(event);
  } catch (error) {

    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Ogiltigt ID-format" });
    }
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
})

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

export default eventRouter;
