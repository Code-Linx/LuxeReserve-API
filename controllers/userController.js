const User = require("../model/guestModel");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

exports.getUserDashboard = catchAsync(async (req, res) => {
  // Example: Fetching user details for the dashboard
  const user = req.user; // This is set by the protect middleware
  res.status(200).json({
    message: `Welcome to your dashboard, ${user.first_name}`,
    user: {
      id: user._id,
      email: user.email,
    },
  });
});

exports.createReservation = async (req, res) => {
  try {
    const {
      hotelName,
      roomType,
      roomNumber,
      checkInDate,
      checkOutDate,
      numberOfGuests,
    } = req.body;

    // Create a new reservation with the provided details
    const reservation = new Reservation({
      user: req.user.id, // Assuming `req.user` is set by the `protect` middleware
      hotelName,
      roomType,
      roomNumber,
      checkInDate,
      checkOutDate,
      numberOfGuests,
    });

    // Save the reservation to the database
    await reservation.save();

    res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
