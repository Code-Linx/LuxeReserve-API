const mongoose = require("mongoose");

const bookingHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  changeType: {
    type: String,
    enum: ["created", "cancelled", "modified"],
    required: [true, "Please specify the change type"],
  },
  changeDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookingHistory", bookingHistorySchema);
