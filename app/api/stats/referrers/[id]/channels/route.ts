// app/api/stats/referrers/[id]/channels/route.ts
//
// Proxy to Laravel: POST /api/analytics/referrers/{id}/channels
// Add a channel to an existing referrer.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.ajur.app";
const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${LARAVEL_API_URL}/api/analytics/referrers/${id}/channels`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[referrers/add-channel] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}