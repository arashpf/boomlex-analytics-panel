// lib/auth.ts
//
// Session helpers for the analytics panel.
// Uses a signed JWT stored in an httpOnly cookie.
//
// Flow:
//   1. User POSTs email + password to /api/auth/login (Next.js route)
//   2. That route forwards to Laravel /api/analytics/auth/login
//   3. Laravel checks analytics_admin table, returns { ok: true }
//   4. Panel signs a JWT with AUTH_SECRET and sets it as httpOnly cookie
//   5. middleware.ts verifies the cookie on every request

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload } from "./types";

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = "ajur_panel_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short (must be at least 32 chars). " +
      "Set it in .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

// ─────────────────────────────────────────────────────────────
// Sign
// ─────────────────────────────────────────────────────────────

export async function createSessionToken(
  adminId: number,
  email: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_DURATION_SECONDS;

  return new SignJWT({ admin_id: adminId, email, iat: now, exp })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(getSecret());
}

// ─────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Cookie helpers (server-side only)
// ─────────────────────────────────────────────────────────────

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}