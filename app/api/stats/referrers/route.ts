// app/api/stats/referrers/route.ts
//
// Proxy to Laravel:
//   GET  /api/analytics/referrers       → list all referrers
//   POST /api/analytics/referrers       → create referrer + channels

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.ajur.app";
const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

function laravelHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
  };
}

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${LARAVEL_API_URL}/api/analytics/referrers`, {
      headers: laravelHeaders(),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[referrers/list] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const res = await fetch(`${LARAVEL_API_URL}/api/analytics/referrers`, {
      method: "POST",
      headers: laravelHeaders(),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[referrers/create] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}