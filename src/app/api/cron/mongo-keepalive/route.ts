import { NextResponse } from "next/server";
import { pingMongoKeepAlive } from "@/lib/mongo-keepalive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when set
  const auth = request.headers.get("authorization");
  if (secret) {
    return auth === `Bearer ${secret}`;
  }
  // Local/dev without secret: allow only localhost
  const host = request.headers.get("host") || "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

/**
 * Vercel Cron hits this every few days so Atlas free tier
 * does not pause from inactivity (~7–20 days idle).
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await pingMongoKeepAlive();
  return NextResponse.json(
    {
      ok: result.ok,
      lastPingAt: result.lastPingAt,
      error: result.error,
      purpose: "atlas-keepalive",
    },
    { status: result.ok ? 200 : 503 }
  );
}
