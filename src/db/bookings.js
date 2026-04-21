import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export async function getBookings() {
  const bookings = await Booking.find().populate("event", "title");
  return bookings.map((b) => ({
    _id: b._id,
    name: b.name,
    email: b.email,
    quantity: b.quantity,
    event: b.event,
    createdAt: b.createdAt,
  }));
}

export async function createBooking({ eventId, quantity = 1, name, email }) {
  const event = await Event.findById(eventId);
  if (!event) return { error: "not_found" };

  const totalBooked = await getTotalBookedSpots(eventId);
  if (totalBooked + quantity > event.maxCapacity) return { error: "full" };

  const booking = new Booking({ event: eventId, quantity, name, email });
  const saved = await booking.save();
  await saved.populate("event", "title date location");

  return {
    booking: {
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      quantity: saved.quantity,
      event: saved.event,
      createdAt: saved.createdAt,
    },
  };
}

export async function deleteBooking(id) {
  const deleted = await Booking.findByIdAndDelete(id).populate(
    "event",
    "title",
  );
  if (!deleted) return null;
  return {
    _id: deleted._id,
    name: deleted.name,
    email: deleted.email,
    quantity: deleted.quantity,
    event: deleted.event,
    createdAt: deleted.createdAt,
  };
}

export async function getBookingsByEvent(eventId) {
  const event = await Event.findById(eventId);
  if (!event) return null;

  const bookings = await Booking.find({ event: eventId });
  const totalBooked = await getTotalBookedSpots(eventId);

  return {
    event: event.toObject(),
    bookings,
    spotsLeft: Math.max(0, event.maxCapacity - totalBooked),
  };
}

export async function getTotalBookedSpots(eventId) {
  const result = await Booking.aggregate([
    {
      $match: {
        event: mongoose.Types.ObjectId.createFromHexString(String(eventId)),
      },
    },
    { $group: { _id: null, total: { $sum: { $ifNull: ["$quantity", 1] } } } },
  ]);
  return result[0]?.total || 0;
}
