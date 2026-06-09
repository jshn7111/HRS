import Booking from '../models/Booking.js';

export const createBooking = (payload) => Booking.create(payload);
export const getBookingsByUser = (userId) => Booking.find({ user: userId });
export const getBookingsByHotels = (hotelIds) => Booking.find({ hotel: { $in: hotelIds } });
