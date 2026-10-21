import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  // Validate MONGO_URI
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }

  // Connect to MongoDB
  await mongoose.connect(env.MONGO_URI);
  console.log('✅ MongoDB connected');
  console.log("🚀 SERVER DB NAME:", mongoose.connection.name);
};
