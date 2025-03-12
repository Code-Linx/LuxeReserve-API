const express = require("express");
const authController = require("../controllers/adminAuthController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
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

//PROTECTED ROUTE
router.use(authController.protect);
router.use(authController.restrictTo("admin"));
router.post("/add-hotel", adminController.addHotel);
router.post("/add-receptionist", adminController.addReceptionist);
router.get("/receptionists", adminController.getAllReceptionists);
router.get("/:id/receptionists/", adminController.getReceptionistById);
router.post("/room", adminController.createRoom);
router.patch("/:id/room", adminController.updateRoomDetails);
router.get("/all-room", adminController.getAllRooms);
router.get("/:id/roombyId", adminController.getRoomById);
router.delete("/:roomId/delete-room", adminController.deleteRoom);

router.post("/log-out", authController.logout);
module.exports = router;
