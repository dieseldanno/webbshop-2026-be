import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import eventRouter from "./routes/event.js";
import bookingRouter from "./routes/bookings.js";
import cors from "cors";

const app = express();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Webbshop API",
    stack: "MEN (MongoDB, Express, Node.js)",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/events", eventsRouter);
app.use("/event", eventRouter);
app.use("/bookings", bookingRouter);
//TODO: Add more routes as needed

export default app;
