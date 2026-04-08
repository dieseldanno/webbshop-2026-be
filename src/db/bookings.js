import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export async function createBooking({ eventId, quantity = 1, name, email }) {
  const event = await Event.findById(eventId);
  if (!event) return { error: "not_found" };

  const bookedSpots = await Booking.aggregate([
    { $match: { event: mongoose.Types.ObjectId.createFromHexString(eventId) } },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  const totalBooked = bookedSpots[0]?.total || 0;
  if (totalBooked + quantity > event.maxCapacity) return { error: "full" };
  const booking = new Booking({ event: eventId, quantity, name, email });
  return { booking: await booking.save() };
}

export async function deleteBooking(id) {
  const deleted = await Booking.findByIdAndDelete(id).populate(
    "event",
    "title",
  );
  if (!deleted) return null;
  return deleted;
}

export async function getBookingsByEvent(eventId) {
  const event = await Event.findById(eventId);
  if (!event) return null;

  const bookings = await Booking.find({ event: eventId });
  const bookingCount = bookings.length;

  return {
    event: event.toObject(),
    bookings,
    spotsLeft: event.maxCapacity - bookingCount,
  };
}
