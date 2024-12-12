const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
    default: "guest",
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Only runs this validation if the password is being modified or created
      validator: function (el) {
        // Only validate if password is new or modified
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },

  passwordChangedAt: Date, // Track when the password was changed
  passwordResetCode: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  isVerified: {
    type: Boolean,
    default: false, // Set to true after email verification
  },

  emailVerificationCode: {
    type: String, // Stores the code sent to the user for email verification
  },

  emailVerificationExpires: {
    type: Date, // Code expiration time (e.g., valid for 24 hours)
  },
  // Reference to the hotel managed by the admin
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Please associate an admin with a hotel"],
  },
});

module.exports = mongoose.model("Admin", adminSchema);
