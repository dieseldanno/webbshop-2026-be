import "dotenv/config";
import { readFile } from "fs/promises";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../config/database.js";

const EVENTS_PATH = new URL("../data/events.json", import.meta.url);
const BOOKINGS_PATH = new URL("../data/bookings.json", import.meta.url);

async function seedEvents() {
  if ((await Event.countDocuments()) > 0) return;
  const eventsFromFile = JSON.parse(await readFile(EVENTS_PATH, "utf8"));
  const toInsert = eventsFromFile.map((a) => ({
    _id: a._id,
    title: a.title,
    description: a.description,
    date: a.date,
    location: a.location,
    maxCapacity: a.maxCapacity,
    price: a.price,
    imageUrl: a.imageUrl,
    category: a.category,
  }));
  await Event.insertMany(toInsert);
  console.info("Events seeded");
}

async function seedBooking() {
  if ((await Booking.countDocuments()) > 0) return;
  const bookingsFromFile = JSON.parse(await readFile(BOOKINGS_PATH, "utf8"));
  const toInsert = bookingsFromFile.map((a) => ({
    _id: a._id,
    event: a.event,
    quantity: a.quantity,
    name: a.name,
    email: a.email,
  }));
  await Booking.insertMany(toInsert);
  console.info("Bookings seeded");
}

async function seedIfEmpty() {
  await seedEvents(); // events first
  await seedBooking(); // then bookings
}

connectToDatabase("grupp9.ex3asho.mongodb.net")
  .then(() => seedIfEmpty())
  .then(() => disconnectFromDatabase())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
