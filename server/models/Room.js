import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
