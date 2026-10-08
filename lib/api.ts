// lib/api.ts
//
// Thin fetch wrapper for talking to the Laravel analytics API.
// Adds the shared X-Analytics-Token header on every request.
//
// IMPORTANT: This file runs on the server (Server Components) and
// client. It never exposes LARAVEL_PANEL_TOKEN to the browser — that
// header is only added when the request originates server-side.

import type {
    OverviewResponse,
    FunnelsResponse,
    ListingsResponse,
    CitiesResponse,
    SessionsResponse,
    RealtimeResponse,
    DateRange,
  } from "./types";
  
  // ─────────────────────────────────────────────────────────────
  // Config
  // ─────────────────────────────────────────────────────────────
  
  const LARAVEL_API_URL =
    process.env.LARAVEL_API_URL || "https://api.ajur.app";
  
  const LARAVEL_PANEL_TOKEN = process.env.LARAVEL_PANEL_TOKEN || "";
  
  // ─────────────────────────────────────────────────────────────
  // Core fetcher
  // ─────────────────────────────────────────────────────────────
  
  interface FetchOptions {
    method?: "GET" | "POST";
    body?: unknown;
    cache?: RequestCache;   // default: "no-store" so we always get fresh data
  }
  
  export class ApiError extends Error {
    status: number;
    body: unknown;
  
    constructor(message: string, status: number, body: unknown) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.body = body;
    }
  }
  
  async function apiFetch<T>(
    path: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, cache = "no-store" } = options;
  
    const url = `${LARAVEL_API_URL}${path}`;
  
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
  
    // Only add the panel token when running server-side.
    // (Never expose this to the browser.)
    if (typeof window === "undefined" && LARAVEL_PANEL_TOKEN) {
      headers["X-Analytics-Token"] = LARAVEL_PANEL_TOKEN;
    }
  
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
  
    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
    });
  
    let parsed: unknown = null;
    const text = await res.text();
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }
  
    if (!res.ok) {
      throw new ApiError(
        `API ${method} ${path} failed: ${res.status}`,
        res.status,
        parsed
      );
    }
  
    return parsed as T;
  }
  
  // ─────────────────────────────────────────────────────────────
  // Endpoints
  // ─────────────────────────────────────────────────────────────
  
  export async function fetchOverview(
    range: DateRange = "7d"
  ): Promise<OverviewResponse> {
    return apiFetch<OverviewResponse>(
      `/api/analytics/stats/overview?range=${range}`
    );
  }
  
  export async function fetchFunnels(
    range: DateRange = "7d"
  ): Promise<FunnelsResponse> {
    return apiFetch<FunnelsResponse>(
      `/api/analytics/stats/funnels?range=${range}`
    );
  }
  
  export async function fetchListings(
    range: DateRange = "7d"
  ): Promise<ListingsResponse> {
    return apiFetch<ListingsResponse>(
      `/api/analytics/stats/listings?range=${range}`
    );
  }
  
  export async function fetchCities(
    range: DateRange = "7d"
  ): Promise<CitiesResponse> {
    return apiFetch<CitiesResponse>(
      `/api/analytics/stats/cities?range=${range}`
    );
  }
  
  export async function fetchSessions(
    range: DateRange = "7d"
  ): Promise<SessionsResponse> {
    return apiFetch<SessionsResponse>(
      `/api/analytics/stats/sessions?range=${range}`
    );
  }
  
  export async function fetchRealtime(): Promise<RealtimeResponse> {
    return apiFetch<RealtimeResponse>(`/api/analytics/stats/realtime`);
  }