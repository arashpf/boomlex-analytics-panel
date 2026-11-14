// app/api/stats/platform/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";

  const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.boomlex.ir";
  const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

  try {
    const res = await fetch(
      `${LARAVEL_API_URL}/api/analytics/stats/platform?range=${range}`,
      {
        headers: {
          Accept: "application/json",
          "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
        },
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[stats/platform] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}