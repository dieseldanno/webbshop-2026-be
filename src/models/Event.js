import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      enum: ["Stockholm", "Uppsala", "Göteborg", "Malmö"],
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
      enum: [
        "Music",
        "Sport",
        "Art & culture",
        "Health",
        "Dance",
        "Social activities",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
