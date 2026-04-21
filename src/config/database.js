import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase(databaseName) {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.info(`Connected to ${mongoose.connection.name} database`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState === 0) return;
  try {
    await mongoose.disconnect();
    console.info("Disconnected from database");
  } catch (err) {
    console.error("Error disconnecting from database", err);
  }
}

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
