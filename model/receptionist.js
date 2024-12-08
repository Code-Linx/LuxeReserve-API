const mongoose = require("mongoose");

const receptionistSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please provide your first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please provide your last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation regex
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    default: "receptionist",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }, // Reference to the hotel they work for
});

module.exports = mongoose.model("Receptionist", receptionistSchema);
