const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: [true, "Please specify the room type"],
  },
  pricePerNight: {
    type: Number,
    required: [true, "Please specify the price per night"],
  },
  availabilityStatus: {
    type: Boolean,
    default: true, // true = available, false = booked
  },
  amenities: [String], // List of amenities (e.g., Wi-Fi, TV, etc.)
  maxOccupancy: {
    type: Number,
    required: [true, "Please specify the maximum occupancy"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Room", roomSchema);
