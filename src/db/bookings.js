import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export async function createBooking({ eventId, name, email }) {
  const event = await Event.findById(eventId);
  if (!event) return { error: "not_found" };

  const bookingCount = await Booking.countDocuments({ event: eventId });

  if (bookingCount >= event.maxCapacity) return { error: "full" };
  const booking = new Booking({ event: eventId, name, email });
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
