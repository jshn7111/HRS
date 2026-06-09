import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

export const createBooking = async (req, res) => {
  const { hotel, room, checkIn, checkOut, guests, amount } = req.body;
  const booking = new Booking({
    user: req.user._id,
    hotel,
    room,
    checkIn,
    checkOut,
    guests,
    amount,
    status: 'pending',
  });
  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('hotel room');
  res.json(bookings);
};

export const getOwnerBookings = async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id }).select('_id');
  const hotelIds = hotels.map((hotel) => hotel._id);
  const bookings = await Booking.find({ hotel: { $in: hotelIds } }).populate('user hotel room');
  res.json(bookings);
};

export const updateBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  Object.assign(booking, req.body);
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
};
