export const validateHotel = (data) => {
  const errors = [];
  if (!data.name) errors.push('Hotel name is required');
  if (!data.description) errors.push('Description is required');
  if (!data.location) errors.push('Location is required');
  return errors;
};
