import "dotenv/config";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../config/database.js";

async function tearDown() {
  await connectToDatabase();
  await Booking.deleteMany();
  await Event.deleteMany();
  console.info("Database cleared");
  await disconnectFromDatabase();
}

tearDown().catch((err) => {
  console.error(err);
  process.exit(1);
});
