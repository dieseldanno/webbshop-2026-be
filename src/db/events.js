import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import { getTotalBookedSpots } from "./bookings.js";

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
      const totalBooked = await getTotalBookedSpots(event._id);
      return {
        ...event.toObject(),
        spotsLeft: Math.max(0, event.maxCapacity - totalBooked),
      };
    }),
  );
  return eventsWithSpots;
}

export async function getEventById(eventId) {
  const event = await Event.findById(eventId);
  if (!event) return null;
  // Räkna bokningar live för detta specifika event
  const totalBooked = await getTotalBookedSpots(event._id);
  return {
    ...event.toObject(),
    spotsLeft: Math.max(0, event.maxCapacity - totalBooked),
  };
}

export async function getEventBookings(eventId) {
  const event = await Event.findById(eventId);
  if (!event) return null;

  const bookings = await Booking.find({ event: eventId }).sort({
    createdAt: -1,
  });
  const totalBooked = await getTotalBookedSpots(eventId);
  return {
    bookings: bookings.map((b) => b.toObject()),
    spotsLeft: Math.max(0, event.maxCapacity - totalBooked),
    totalBooked: totalBooked,
  };
}

export async function createEvent(eventData) {
  const event = new Event(eventData);
  return await event.save();
}

export async function updateEvent(eventId, eventData) {
  const event = await Event.findByIdAndUpdate(eventId, eventData, {
    new: true,
    runValidators: true,
  });
  if (!event) return null;
  const totalBooked = await getTotalBookedSpots(event._id);
  return {
    ...event.toObject(),
    spotsLeft: Math.max(0, event.maxCapacity - totalBooked),
  };
}

export async function deleteEvent(eventId) {
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) return null;

  await Booking.deleteMany({ event: eventId });
  return event;
}
