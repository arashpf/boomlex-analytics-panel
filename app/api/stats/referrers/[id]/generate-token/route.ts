// app/api/stats/referrers/[id]/generate-token/route.ts
//
// Proxy to Laravel: POST /api/analytics/referrers/{id}/generate-token
// Returns the new self-service access token + portal URL.

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

export async function POST(_req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const res = await fetch(
      `${LARAVEL_API_URL}/api/analytics/referrers/${id}/generate-token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
        },
        cache: "no-store",
      }
    );
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[referrers/generate-token] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}