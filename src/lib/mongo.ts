import dns from "dns";
import mongoose from "mongoose";

// Windows/ISP DNS: prefer IPv4 so mongodb+srv SRV lookup works reliably
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI?.trim();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectMongo(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not set — response cache disabled");
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "ai_portfolio",
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection failed:", error);
    return null;
  }
}
