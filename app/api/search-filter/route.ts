// app/api/stats/search-filter/route.ts
//
// Proxy to Laravel: GET /api/analytics/stats/search-filter?range=7d

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";

  const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.ajur.app";
  const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

  try {
    const res = await fetch(
      `${LARAVEL_API_URL}/api/analytics/stats/search-filter?range=${range}`,
      {
        headers: {
          Accept: "application/json",
          "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
        },
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[stats/search-filter] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}