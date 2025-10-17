import mongoose from 'mongoose';
import { env } from '../config/env.config';

const MONGO_URI = env.MONGO_URI;

/**
 * Establishes the connection to MongoDB.
 * @returns {Promise<void>}
 */
export async function dbConnect(): Promise<void> {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}