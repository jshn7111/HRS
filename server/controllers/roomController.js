import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

export const getRoomsByHotel = async (req, res) => {
  const rooms = await Room.find({ hotel: req.params.hotelId });
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }
  const room = new Room({ ...req.body, hotel: req.params.hotelId });
  const createdRoom = await room.save();
  hotel.rooms.push(createdRoom._id);
  await hotel.save();
  res.status(201).json(createdRoom);
};

export const updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  Object.assign(room, req.body);
  const updatedRoom = await room.save();
  res.json(updatedRoom);
};

export const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  await room.remove();
  res.json({ message: 'Room removed' });
};
