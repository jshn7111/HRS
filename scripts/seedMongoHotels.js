const fs = require('node:fs/promises');
const path = require('node:path');

try {
  require('dotenv').config();
} catch {
  // dotenv is optional for this seed script.
}

const mongoose = require('mongoose');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOTELS_JSON = path.join(ROOT_DIR, 'data', 'hotels.json');
const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/ai_hotel_booking';

const hotelSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    hotel_name: { type: String, required: true, unique: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    star_rating: { type: Number, required: true },
    review_score: { type: Number, required: true },
    review_count: { type: Number, required: true },
    price_per_night: { type: Number, required: true },
    category: { type: String, enum: ['Budget', 'Standard', 'Premium', 'Luxury'], required: true, index: true },
    amenities: [{ type: String }],
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    created_at: { type: Date, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: undefined },
    },
  },
  {
    collection: 'hotels',
    timestamps: false,
  }
);

hotelSchema.index({ location: '2dsphere' });
hotelSchema.index({ city: 1, price_per_night: 1 });
hotelSchema.index({ city: 1, review_score: -1 });

const Hotel = mongoose.models.HotelSeed || mongoose.model('HotelSeed', hotelSchema);

async function main() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_MONGO_URI;
  const raw = await fs.readFile(HOTELS_JSON, 'utf8');
  const hotels = JSON.parse(raw).map((hotel) => ({
    ...hotel,
    created_at: new Date(hotel.created_at),
    location: {
      type: 'Point',
      coordinates: [hotel.longitude, hotel.latitude],
    },
  }));

  await mongoose.connect(mongoUri);
  await Hotel.deleteMany({});
  await Hotel.insertMany(hotels, { ordered: false });
  await Hotel.syncIndexes();
  await mongoose.disconnect();

  console.log(`Seeded ${hotels.length} hotels into MongoDB collection "hotels"`);
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
