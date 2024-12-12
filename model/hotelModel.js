const mongoose = require("mongoose");

// Hotel Schema
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the hotel name"],
  },
  address: {
    type: String,
    required: [true, "Please provide the hotel address"],
  },
  contactNumber: {
    type: String,
    required: [true, "Please provide the hotel contact number"],
  },
  email: {
    type: String,
    required: [true, "Please provide the hotel email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation regex
      },
      message: "Please enter a valid email address",
    },
  },
  description: {
    type: String,
    required: [true, "Please provide a description of the hotel"],
  },
  website: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\w\d\-]+(\.[\w\d\-]+)+)(\/[\w\d\-._~:?#\[\]@!$&'()*+,;=]*)?$/i.test(
          v
        ); // URL validation regex
      },
      message: "Please provide a valid website URL",
    },
  },
  amenities: {
    type: [String], // Array of amenities like "Free Wi-Fi", "Gym", "Swimming Pool", etc.
    default: [],
  },
  maxOccupancy: {
    type: Number, // Maximum number of guests the hotel can accommodate
    required: [true, "Please provide the maximum occupancy of the hotel"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model("Hotel", hotelSchema);
