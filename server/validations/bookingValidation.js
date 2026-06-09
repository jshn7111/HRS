export const validateBooking = (data) => {
  const errors = [];
  if (!data.hotel) errors.push('Hotel is required');
  if (!data.room) errors.push('Room is required');
  if (!data.checkIn) errors.push('Check-in date is required');
  if (!data.checkOut) errors.push('Check-out date is required');
  if (!data.amount) errors.push('Amount is required');
  return errors;
};
