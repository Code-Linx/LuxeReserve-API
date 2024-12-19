const express = require("express");
const authController = require("../controllers/adminAuthController");
const userController = require("../controllers/adminController");

const router = express.Router();

router.post("/register", authController.register);
router.post(
  "/resend-otp",
  authController.resendVerificationLimiter,
  authController.resendVerificationCode
);
router.post("/verify-email", authController.verifyEmail);
router.post(
  "/forget-password",
  authController.passwordResetLimiter,
  authController.resetpassword
);

router.post("/verify-password-reset-otp", authController.verifyResetCode);
router.post(
  "/resend-password-reset-otp",
  authController.passwordResetLimiter,
  authController.requestNewCode
);
router.post("/login", authController.login);
router.post("/log-out", authController.logout);

//PROTECTED ROUTE
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

module.exports = router;