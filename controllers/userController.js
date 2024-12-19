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

