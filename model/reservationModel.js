const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, "Please provide the guest's name"],
  },
  guestEmail: {
    type: String,
    required: [true, "Please provide the guest's email"],
  },
  guestPhoneNumber: {
    type: String,
    required: [true, "Please provide the guest's phone number"],
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: [true, "Please specify the room for the reservation"],
  },
  checkInDate: {
    type: Date,
    required: [true, "Please provide a check-in date"],
  },
  checkOutDate: {
    type: Date,
    required: [true, "Please provide a check-out date"],
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
