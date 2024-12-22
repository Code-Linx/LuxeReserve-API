const Receptionist = require("../model/receptionistModel");
const Hotel = require("../model/hotelModel");
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
    console.log(err.message);
  }
});
