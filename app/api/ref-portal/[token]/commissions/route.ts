// app/api/ref-portal/[token]/commissions/route.ts
//
// Proxy to Laravel: GET /api/analytics/ref-portal/{token}/commissions
// Forwards limit + page from the query string.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.ajur.app";

interface Ctx {
  params: Promise<{ token: string }>;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { token } = await ctx.params;

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const search = req.nextUrl.searchParams.toString();
  const url = `${LARAVEL_API_URL}/api/ref-portal/${encodeURIComponent(
    token
  )}/commissions${search ? `?${search}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[ref-portal/commissions] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}