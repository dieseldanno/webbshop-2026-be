import { Router } from "express";
const eventRouter = Router();
import { authMiddleware } from "../middleware/authMiddleware.js";
import {  getEventById } from "../db/events.js";

eventRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Ogiltigt ID-format" });
    }
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
});

export default eventRouter;
