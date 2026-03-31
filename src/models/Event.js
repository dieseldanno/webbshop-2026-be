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
    currentBookings: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Music", "Sport", "Theater", "Other"],
      required: true,
    },
  },
  {
    timestamps: true,
    // Detta gör att vi kan skicaka med "virtials" som spotLeft till Frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Här visar hur många plats kvar.
eventSchema.virtual("spotLeft").get(function () {
  return this.maxCapacity - this.currentBookings;
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
