import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

async function testConnection() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

testConnection();
