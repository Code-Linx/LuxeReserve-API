const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Function to generate a random 6-digit code
function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
}

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
    default: "admin",
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
  // hotel: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Hotel",
  //   required: [true, "Please associate an admin with a hotel"],
  // },
});

// Middleware to hash the password before saving the user document
adminSchema.pre("save", async function (next) {
  // Only hash if the password is new or being modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm field after validation
  this.passwordConfirm = undefined;
  next();
});

// Middleware to set the passwordChangedAt timestamp when password is modified
adminSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Ensures the timestamp is slightly before JWT is issued
  next();
});

// Method to check if the password is correct
adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to generate and hash the email verification code
adminSchema.methods.createEmailVerificationCode = function () {
  const verificationCode = generateSixDigitCode(); // Generate a 6-digit code

  // Hash the code using crypto and save it to the database
  this.emailVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // Expires in 24 hours

  return verificationCode; // Return the plain code to send via email
};

// Method to check if the password has been changed after a token was issued
adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Method to generate a password reset code
adminSchema.methods.createPasswordResetCode = function () {
  const resetCode = generateSixDigitCode(); // Generate a 6-digit code

  this.passwordResetCode = resetCode; // Store the code in DB
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes

  return resetCode; // Return plain code to send in the email
};

module.exports = mongoose.model("Admin", adminSchema);
