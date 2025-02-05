const Reservation = require("../model/reservationModel");
const Room = require("../model/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.find();

  res.status(200).json({
    status: "success",
    results: rooms.length,
    data: {
      rooms,
    },
  });
});

exports.updateRoomStatus = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const { availabilityStatus, maintenanceStatus } = req.body;

  const room = await Room.findById(roomId);

  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  if (availabilityStatus !== undefined)
    room.availabilityStatus = availabilityStatus;
  if (maintenanceStatus !== undefined)
    room.maintenanceStatus = maintenanceStatus;

  room.updatedAt = Date.now();

  const updatedRoom = await room.save();

  res.status(200).json({
    status: "success",
    data: {
      room: updatedRoom,
    },
  });
});

exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  // 1. Query all rooms with availabilityStatus set to true
  const availableRooms = await Room.find({ availabilityStatus: true });

  // 2. Check if there are available rooms
  if (availableRooms.length === 0) {
    return next(new AppError("No available rooms at the moment", 404));
  }

  // 3. Send the response with the available rooms
  res.status(200).json({
    status: "success",
    results: availableRooms.length,
    data: {
      rooms: availableRooms,
    },
  });
});

exports.createReservation = catchAsync(async (req, res, next) => {
  const {
    guestName,
    guestEmail,
    guestPhoneNumber,
    room,
    checkInDate,
    checkOutDate,
  } = req.body;

  // 1. Validate the room exists and is available
  const selectedRoom = await Room.findById(room);
  if (!selectedRoom) {
    return next(new AppError("The specified room does not exist", 404));
  }
  if (!selectedRoom.availabilityStatus) {
    return next(new AppError("The selected room is not available", 400));
  }

  // 2. Create a new reservation
  const newReservation = await Reservation.create({
    guestName,
    guestEmail,
    guestPhoneNumber,
    room,
    checkInDate,
    checkOutDate,
  });

  // 3. Update the room's availability status
  selectedRoom.availabilityStatus = false;
  await selectedRoom.save();

  // 4. Return the reservation details
  res.status(201).json({
    status: "success",
    data: {
      reservation: newReservation,
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

exports.getReservationById = catchAsync(async (req, res, next) => {
  const { reservationId } = req.params;

  // Find reservation by ID and populate room details
  const reservation = await Reservation.findById(reservationId).populate(
    "room",
    "roomType pricePerNight"
  );

  if (!reservation) {
    return next(new AppError("Reservation not found", 404));
  }

  // Return the reservation details
  res.status(200).json({
    status: "success",
    data: {
      reservation,
    },
  });
});
