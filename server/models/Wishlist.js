import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
