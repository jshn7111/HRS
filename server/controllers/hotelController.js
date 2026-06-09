import Hotel from '../models/Hotel.js';

export const getHotels = async (req, res) => {
  const hotels = await Hotel.find().populate('owner', 'name email');
  res.json(hotels);
};

export const getHotelById = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('rooms')
    .populate('reviews');
  if (hotel) {
    return res.json(hotel);
  }
  res.status(404).json({ message: 'Hotel not found' });
};

export const createHotel = async (req, res) => {
  const hotel = new Hotel({
    ...req.body,
    owner: req.user._id,
  });
  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
};

export const updateHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }
  if (hotel.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  Object.assign(hotel, req.body);
  const updatedHotel = await hotel.save();
  res.json(updatedHotel);
};

export const deleteHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }
  if (hotel.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await hotel.remove();
  res.json({ message: 'Hotel removed' });
};
