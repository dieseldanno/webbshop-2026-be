import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
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
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Music", "Sport", "Theater", "Other"],
    required: true,
  },
  timestamps: true,
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
