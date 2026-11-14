// app/api/ref-portal/[token]/route.ts
//
// Proxy to Laravel ref-portal endpoints.
//   GET /api/ref-portal/{token}?action=me    → /api/analytics/ref-portal/{token}/me
//   GET /api/ref-portal/{token}?action=stats → /api/analytics/ref-portal/{token}/stats
//
// These are PUBLIC (no admin auth needed) — the URL token IS the auth.
// Next.js just forwards the token, no cookies or bearer token required.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.boomlex.ir";

interface Ctx {
  params: Promise<{ token: string }>;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { token } = await ctx.params;
  const action = req.nextUrl.searchParams.get("action") || "me";

  // Whitelist actions to prevent SSRF
  if (!["me", "stats", "commissions"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${LARAVEL_API_URL}/api/ref-portal/${encodeURIComponent(token)}/${action}`,
      {
        headers: {
          Accept: "application/json",
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
    console.error("[ref-portal] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}