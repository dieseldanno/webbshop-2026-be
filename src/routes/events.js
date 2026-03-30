import { Router } from "express";
const eventRouter = Router();
import Event from "../models/Event.js";

eventRouter.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
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
