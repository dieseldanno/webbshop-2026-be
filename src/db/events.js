import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export async function getEvents(filters = {}) {
  const query = {};

  if (filters.location) {
    query.location = filters.location;
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.date) {
    query.date = { $gt: new Date(filters.date) };
  }
  const events = await Event.find(query).sort({ date: 1 });
  
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

export async function getEventById(eventId) {
  const event = await Event.findById(eventId);
  if (!event) return null;
  // Räkna bokningar live för detta specifika event
  const bookingCount = await Booking.countDocuments({ event: event._id });
  return {
    ...event.toObject(),
    spotsLeft: event.maxCapacity - bookingCount,
  };
}

export async function createEvent(eventData) {
  const event = new Event(eventData);
  return await event.save();
}

export async function updateEvent(eventId, eventData) {
  const event = await Event.findByIdAndUpdate(eventId, eventData, 
    { new: true, runValidators: true }
);
  if (!event) return null;
  const bookingCount = await Booking.countDocuments({ event: event._id });
  return {
    ...event.toObject(),
    spotLeft: event.maxCapacity - bookingCount,
  };
}

export async function deleteEvent(eventId) {
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) return null;

  await Booking.deleteMany({ event: eventId });
  return event;
}