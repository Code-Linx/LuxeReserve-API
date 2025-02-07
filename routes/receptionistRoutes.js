const express = require("express");
const receptionistController = require("../controllers/receptionistController");
const authController = require("../controllers/receptionistAuth");

const router = express.Router();

router.post("/login", authController.login);
router.post("/sign-out", authController.logout);

router.use(authController.protect);

router.get("/room", receptionistController.getAllRooms);
router.get("/available-rooms", receptionistController.getAvailableRooms);
router.get("/all-reservations", receptionistController.getAllReservations);

router.post("/reservations", receptionistController.createReservation);
router.get("/:id/reservations,", receptionistController.getReservationById);
router.get("/:id", receptionistController.updateReservation);

router.patch("/:roomId", receptionistController.updateRoomStatus);

module.exports = router;
