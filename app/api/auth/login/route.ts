// app/api/auth/login/route.ts
//
// Handles login: forwards email + password to Laravel, and if Laravel
// says OK, signs a session JWT and sets it as an httpOnly cookie.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email and password are required" },
      { status: 400 }
    );
  }

  const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "https://api.boomlex.ir";
  const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";

  try {
    const laravelRes = await fetch(`${LARAVEL_API_URL}/api/analytics/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Analytics-Token": LARAVEL_PANEL_TOKEN,
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await laravelRes.json().catch(() => ({}));

    if (!laravelRes.ok || !data.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "Invalid credentials" },
        { status: 401 }
      );
    }

    // Laravel confirmed the credentials — issue our own session token
    const sessionToken = await createSessionToken(
      data.admin_id ?? 0,
      data.email ?? email
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json(
      { ok: false, error: "Upstream error. Try again." },
      { status: 502 }
    );
  }
}