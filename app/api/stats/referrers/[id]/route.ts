// app/api/stats/referrers/[id]/route.ts
//
// Proxy to Laravel:
//   GET    /api/analytics/referrers/{id}   → single referrer
//   PATCH  /api/analytics/referrers/{id}   → update
//   DELETE /api/analytics/referrers/{id}   → soft-disable

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.boomlex.ir";
const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

function laravelHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
  };
}

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const res = await fetch(`${LARAVEL_API_URL}/api/analytics/referrers/${id}`, {
      headers: laravelHeaders(),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[referrers/get] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
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
    const res = await fetch(`${LARAVEL_API_URL}/api/analytics/referrers/${id}`, {
      method: "PATCH",
      headers: laravelHeaders(),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[referrers/update] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const res = await fetch(`${LARAVEL_API_URL}/api/analytics/referrers/${id}`, {
      method: "DELETE",
      headers: laravelHeaders(),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[referrers/delete] error:", err);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}