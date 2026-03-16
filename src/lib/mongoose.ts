import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cache = global.__mongoose_cache ?? { conn: null, promise: null };
global.__mongoose_cache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI as string, { bufferCommands: false });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
