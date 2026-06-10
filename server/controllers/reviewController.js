import Review from '../models/Review.js';

export const getReviewsByHotel = async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({
      user: req.user._id,
      hotel: req.params.hotelId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }
    const review = await Review.create({
      user: req.user._id,
      hotel: req.params.hotelId,
      rating,
      comment,
    });
    const populated = await review.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
