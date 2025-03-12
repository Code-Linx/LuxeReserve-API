const Receptionist = require("../model/receptionistModel");
const Hotel = require("../model/hotelModel");
const Room = require("../model/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

exports.addHotel = catchAsync(async (req, res, next) => {
  try {
    // 1. Validate the input data
    const {
      hotelName,
      address,
      contactNumber,
      hotelEmail,
      description,
      website,
      amenities,
      maxOccupancy,
    } = req.body;

    // Check if the hotel already exists by email
    const existingHotel = await Hotel.findOne({ hotelEmail });
    if (existingHotel) {
      return next(new AppError("A hotel with this email already exists", 400));
    }

    // 2. Create the hotel
    const newHotel = await Hotel.create({
      hotelName,
      address,
      contactNumber,
      hotelEmail,
      description,
      website,
      amenities,
      maxOccupancy,
    });

    // 3. Send a confirmation email to the hotel

    await new Email(newHotel).send("hotelAdded", "Welcome to LuxeServe!");

    // 4. Return a success response
    res.status(201).json({
      status: "success",
      data: {
        hotel: newHotel,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Function to create a receptionist
exports.addReceptionist = catchAsync(async (req, res, next) => {
  try {
    // 1. Validate input data
    const { first_name, last_name, email, phoneNumber, hotelName } = req.body;

    // Ensure required fields are provided
    if (!first_name || !last_name || !email || !hotelName || !phoneNumber) {
      return next(new AppError("Please provide all required fields", 400));
    }

    // 2. Check if the receptionist already exists by email
    const existingReceptionist = await Receptionist.findOne({ email });
    if (existingReceptionist) {
      return next(
        new AppError("A receptionist with this email already exists", 400)
      );
    }

    // Find the hotel by name
    const hotel = await Hotel.findOne({ hotelName });
    if (!hotel) {
      return next(new AppError("The specified hotel does not exist.", 400));
    }

    // 3. Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // 4. Create the receptionist
    const newReceptionist = await Receptionist.create({
      first_name,
      last_name,
      email,
      phoneNumber,
      tempPassword,
      hotelName,
      password: tempPassword,
      passwordConfirm: tempPassword, // Save the temporary password (hashed, if applicable)
      hotel: hotel._id, // Associate with the hotel
    });

    // 5. Send email to the receptionist with their details
    await new Email(newReceptionist).sendReceptionistWelcome(
      "receptionistWelcome",
      "Welcome to LuxeReserve"
    );
    // Schedule deletion of tempPassword after 1 minute
    setTimeout(async () => {
      await Receptionist.findByIdAndUpdate(newReceptionist._id, {
        tempPassword: null,
      });
      console.log(
        `Temporary password for ${newReceptionist.email} has been removed.`
      );
    }, 30000); // 30000 ms = 30 seconds
    // 6. Return a success response
    res.status(201).json({
      status: "success",
      data: {
        receptionist: newReceptionist,
      },
    });
  } catch (err) {
    //console.log(err.message);
    next(err);
  }
});

// Controller Function to Get All Receptionists
exports.getAllReceptionists = catchAsync(async (req, res, next) => {
  try {
    // Find all users with the role of 'receptionist'
    const receptionists = await Receptionist.find({ role: "Receptionist" });

    if (!receptionists || receptionists.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No receptionists found",
      });
    }

    res.status(200).json({
      status: "success",
      results: receptionists.length,
      data: {
        receptionists,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Controller Function to Get a Receptionist by ID
exports.getReceptionistById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the receptionist by ID
    const receptionist = await Receptionist.findById({
      _id: id,
      role: "receptionist",
    });

    if (!receptionist) {
      return res.status(404).json({
        status: "fail",
        message: "Receptionist not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        receptionist,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Controller function for creating a room
exports.createRoom = catchAsync(async (req, res, next) => {
  try {
    // 1. Extract room details from the request body
    const {
      roomType,
      pricePerNight,
      availabilityStatus,
      amenities,
      maxOccupancy,
    } = req.body;

    // 2. Validate required fields
    if (!roomType || !pricePerNight || !maxOccupancy) {
      return next(
        new AppError(
          "Room type, price per night, and maximum occupancy are required.",
          400
        )
      );
    }

    // 3. Create the room in the database
    const newRoom = await Room.create({
      roomType,
      pricePerNight,
      availabilityStatus,
      amenities,
      maxOccupancy,
    });

    // 4. Send a success response
    res.status(201).json({
      status: "success",
      data: {
        room: newRoom,
      },
    });
  } catch (err) {
    next(err); // Pass any error to the global error handler
  }
});

exports.updateRoomDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1. Extract room details from the request body
  const {
    roomType,
    pricePerNight,
    availabilityStatus,
    amenities,
    maxOccupancy,
  } = req.body;

  // 2. Find the room by ID
  const room = await Room.findByIdAndUpdate({ _id: id });

  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  // 3. Update room details
  if (roomType) room.roomType = roomType;
  if (pricePerNight) room.pricePerNight = pricePerNight;
  if (availabilityStatus !== undefined)
    room.availabilityStatus = availabilityStatus;
  if (amenities) room.amenities = amenities;
  if (maxOccupancy) room.maxOccupancy = maxOccupancy;

  room.updatedAt = Date.now(); // Update the timestamp

  // 4. Save the updated room
  const updatedRoom = await room.save();

  // 5. Return the updated room
  res.status(200).json({
    status: "success",
    data: {
      room: updatedRoom,
    },
  });
});

exports.getAllRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.find();

  if (rooms.length === 0) {
    return res.status(200).json({
      status: "success",
      results: rooms.length,
      message: "No rooms Avaliable at the moments",
    });
  }
  res.status(200).json({
    status: "success",
    results: rooms.length,
    data: {
      rooms,
    },
  });
});

exports.getRoomById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const room = await Room.findById({ _id: id });

  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      room,
    },
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;

  // Find and delete the room
  const room = await Room.findByIdAndDelete({ _id: roomId });

  // If the room does not exist
  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  // Respond with success
  res.status(204).json({
    status: "success",
    data: null, // No content in the response for a successful deletion
  });
});
