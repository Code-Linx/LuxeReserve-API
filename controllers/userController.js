const User = require("../model/guestModel");
const bcrypt = require("bcryptjs");
const Reservation = require("../model/reservationModel");
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

exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  // Find available rooms
  const availableRooms = await Room.find({ availabilityStatus: true });

  // If no available rooms, return an error
  if (!availableRooms.length) {
    return next(new AppError("No available rooms at the moment", 404));
  }

  res.status(200).json({
    status: "success",
    results: availableRooms.length,
    data: {
      rooms: availableRooms,
    },
  });
});

exports.getAllReservations = catchAsync(async (req, res, next) => {
  // Fetch all reservations from the database
  const reservations = await Reservation.find().populate(
    "room",
    "roomType pricePerNight"
  );

  if (!reservations || reservations.length === 0) {
    return next(new AppError("No reservations found", 404));
  }

  // Return the reservations
  res.status(200).json({
    status: "success",
    results: reservations.length,
    data: {
      reservations,
    },
  });
});
