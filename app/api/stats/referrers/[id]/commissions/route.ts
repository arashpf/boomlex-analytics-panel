// app/api/stats/referrers/[id]/commissions/route.ts
//
// Proxy to Laravel: GET /api/analytics/referrers/{id}/commissions
// Forwards query string (limit, page, status) to Laravel unchanged.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.boomlex.ir";
const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  // Forward query string verbatim (page, limit, status...)
  const search = req.nextUrl.searchParams.toString();
  const url = `${LARAVEL_API_URL}/api/analytics/referrers/${id}/commissions${
    search ? `?${search}` : ""
  }`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[referrers/commissions] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}