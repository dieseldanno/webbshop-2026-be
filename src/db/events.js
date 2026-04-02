import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export async function getEvents() {
  const events = await Event.find().sort({ date: 1 });

  const eventsWithSpots = await Promise.all(
    events.map(async (event) => {
      const bookingCount = await Booking.countDocuments({ event: event._id });
      return {
        ...event.toObject(),
        spotsLeft: event.maxCapacity - bookingCount,
      };
    }),
  );
  return eventsWithSpots;
}

export async function createEvent(eventData) {
  const event = new Event(eventData);
  return await event.save();
}