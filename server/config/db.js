import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stayease';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    mongoose.set('bufferCommands', false);
    console.error(`MongoDB connection failed: ${error.message}`);
    console.warn('Server will start without database. Install MongoDB or set MONGO_URI in .env');
  }
};

export default connectDB;
