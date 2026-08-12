import { Schema, models, model } from "mongoose";
import { connectMongo } from "@/lib/mongo";

const HeartbeatSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "atlas" },
    lastPingAt: { type: Date, required: true },
    note: { type: String, default: "keepalive" },
  },
  { timestamps: true }
);

const Heartbeat =
  models.AtlasHeartbeat || model("AtlasHeartbeat", HeartbeatSchema);

/**
 * Light write so Atlas M0 free cluster stays active
 * (avoids auto-pause after long inactivity).
 */
export async function pingMongoKeepAlive(): Promise<{
  ok: boolean;
  lastPingAt?: string;
  error?: string;
}> {
  const conn = await connectMongo();
  if (!conn) {
    return { ok: false, error: "Mongo not configured or connection failed" };
  }

  try {
    await conn.connection.db!.admin().command({ ping: 1 });
    const now = new Date();
    await Heartbeat.findOneAndUpdate(
      { key: "atlas" },
      { key: "atlas", lastPingAt: now, note: "keepalive" },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
    return { ok: true, lastPingAt: now.toISOString() };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown keepalive error";
    return { ok: false, error: message };
  }
}
