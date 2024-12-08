const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    roomTypes: [
      {
        type: String, // Array to hold different room types (e.g., "Single", "Suite")
      },
    ],
    amenities: [
      {
        type: String, // Array to hold hotel amenities (e.g., "WiFi", "Pool", "Spa")
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
