const Room = require("../model/roomModel");
const catchAsync = require("../utils/catchAsync");

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
