import mongoose from "mongoose";

// 1. Cache variables to persist the connection across warm serverless invocations
let cachedConnection: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  // 2. If Mongoose is already fully connected, return immediately (saves time)
  if (mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // 3. If a connection attempt is already in progress, reuse that promise
  if (!cachedPromise) {
    // Read environment variable lazily (at call time)
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing from Vercel settings.");
    }

    const opts = {
      bufferCommands: false, // Don't buffer queries if disconnected; fail fast instead
    };

    cachedPromise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("MongoDB Connected Successfully");
      return mongooseInstance;
    });
  }

  try {
    cachedConnection = await cachedPromise;
  } catch (error) {
    // 4. If connection fails, reset cache so the next request can retry
    cachedPromise = null;
    cachedConnection = null;
    throw error;
  }

  return cachedConnection;
};