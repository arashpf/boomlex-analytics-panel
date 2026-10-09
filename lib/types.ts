// lib/types.ts
//
// Shared TypeScript types for analytics API responses.
// These mirror what Laravel returns from /api/analytics/*

// ─────────────────────────────────────────────────────────────
// Common
// ─────────────────────────────────────────────────────────────

export type DateRange = "24h" | "7d" | "30d" | "3m" | "6m" | "1y" | "all";

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

// ─────────────────────────────────────────────────────────────
// Net Income
// ─────────────────────────────────────────────────────────────

export interface NetIncomePoint {
  date: string;
  amount: number;   // Toman
  count: number;
}

export interface NetIncome {
  total: number;            // Toman
  previous_total: number;   // Toman
  trend: number;            // % change vs previous period
  payments_count: number;
  points: NetIncomePoint[];
}

export interface ListingCalls {
    total: number;
    previous_total: number;
    trend: number;
    points: TimeSeriesPoint[];
  }

  export interface ListingsViews {
    total: number;
    previous_total: number;
    trend: number;
    points: TimeSeriesPoint[];
  }

  export interface ActiveUsers {
    total: number;
    new: number;
    returning: number;
    previous_total: number;
    trend: number;
    points: TimeSeriesPoint[];
  }

// ─────────────────────────────────────────────────────────────
// Overview page
// ─────────────────────────────────────────────────────────────

export interface OverviewStats {
  total_events: number;
  unique_users: number;
  sessions: number;
  events_last_hour: number;
  trend: {
    total_events: number;
    unique_users: number;
    sessions: number;
  };
}

export interface EventsOverTime {
  range: DateRange;
  points: TimeSeriesPoint[];
}

export interface TopEvent {
  event_name: string;
  count: number;
}

export interface OverviewResponse {
  range: DateRange;
  net_income: NetIncome;
  listing_calls: ListingCalls;
  listings_views: ListingsViews;
  active_users: ActiveUsers;
  stats: OverviewStats;
  events_over_time: EventsOverTime;
  top_events: TopEvent[];
}

// ─────────────────────────────────────────────────────────────
// Other pages (kept as placeholders for now)
// ─────────────────────────────────────────────────────────────

export interface FunnelStep {
  step: string;
  event_name: string;
  count: number;
  conversion: number;
}

export interface Funnel {
  name: string;
  steps: FunnelStep[];
}

// ─────────────────────────────────────────────────────────────
// Funnels
// ─────────────────────────────────────────────────────────────

export interface FunnelStep {
  step: string;
  event_name: string;
  count: number;
  conversion: number;
}

export interface Funnel {
  name: string;
  steps: FunnelStep[];
}

export interface FunnelsResponse {
  range: DateRange;
  funnels: Funnel[];
}

// ─────────────────────────────────────────────────────────────
// Listings
// ─────────────────────────────────────────────────────────────

export interface ListingStat {
  listing_id: number;
  creator_user_id: number;
  views: number;
  calls: number;
  favorites: number;
  conversion: number;   // % (calls / views)
}

export interface ListingsSummary {
  listings_viewed: number;
  total_views: number;
  total_calls: number;
  total_favorites: number;
}

export interface ListingsResponse {
  summary: ListingsSummary;
  top_viewed: ListingStat[];
  top_called: ListingStat[];
}

// ─────────────────────────────────────────────────────────────
// Cities
// ─────────────────────────────────────────────────────────────

export interface CityMetrics {
  city_id: number;
  city_title: string;
  city_slug: string;
  city_views: number;
  category_views: number;
  listing_views: number;
  unique_users: number;
  income: number;         // Toman
  income_pct: number;     // 0-100
  payments_count: number;
}

export interface CitiesSummary {
  cities_active: number;
  total_events: number;
  total_income: number;   // Toman
}

export interface IncomeDonutSlice {
  label: string;
  value: number;          // Toman
  pct: number;            // 0-100
}

export interface CitiesResponse {
  summary: CitiesSummary;
  top_by_income: CityMetrics[];
  top_by_city_views: CityMetrics[];
  top_by_category_views: CityMetrics[];
  top_by_listing_views: CityMetrics[];
  income_donut: IncomeDonutSlice[];
}

export interface SessionBucket {
  bucket: string;      // "0-30s" | "30s-2m" | "2m-10m" | "10m+"
  sessions: number;
  pct: number;         // 0-100
}

export interface SessionsResponse {
  total_sessions: number;
  avg_session_seconds: number;
  bounce_rate: number;   // 0-100
  distribution: SessionBucket[];
}

// ─────────────────────────────────────────────────────────────
// Realtime
// ─────────────────────────────────────────────────────────────

export interface RealtimeEvent {
  id: number;
  event_name: string;
  listing_id: number | null;
  city_slug: string | null;
  city_id: number | null;
  category_slug: string | null;
  query: string | null;
  created_at: string;
}

export interface RealtimeResponse {
  events: RealtimeEvent[];
  recent_events: number;      // last 5 min
  active_users: number;       // distinct anon_id, last 5 min
  seconds_since_last: number | null;
  generated_at: string;
}

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  token?: string;
  error?: string;
}

export interface SessionPayload {
  admin_id: number;
  email: string;
  iat: number;
  exp: number;
}

// ─────────────────────────────────────────────────────────────
// Agents
// ─────────────────────────────────────────────────────────────

export interface AgentSummary {
  total_agents: number;
  paid_agents_count: number;
  paid_agents_pct: number;
  no_listing_agents: number;
  returned_agents_pct: number;
}

export interface AgentCityStat {
  city_id: number;
  city_title: string;
  agent_count: number;
}

export interface AgentVisitedStat {
  agent_id: number;
  views: number;
  listings_count: number;
}

export interface AgentPaidStat {
  agent_id: number;
  payments: number;
  total_income: number;    // Toman
}

export interface AgentsResponse {
  summary: AgentSummary;
  top_cities: AgentCityStat[];
  top_visited_agents: AgentVisitedStat[];
  top_paid_agents: AgentPaidStat[];
}

// ─────────────────────────────────────────────────────────────
// Upgrade Plans
// ─────────────────────────────────────────────────────────────

export interface PlanSummary {
  paid_listings: number;
  failed_pct: number;
  failed_count: number;
  total_attempts: number;
  total_revenue: number;      // Toman
  total_plans_sold: number;
}

export interface PlanStat {
  plan_id: string;
  plan_title: string;
  plan_type: string;
  days: number | null;
  calls: number | null;
  price: number;
  sold: number;
  revenue: number;            // Toman
}

export interface PlansResponse {
  summary: PlanSummary;
  top_by_sold: PlanStat[];
  top_by_income: PlanStat[];
  least_sold: PlanStat[];
}


// ─────────────────────────────────────────────────────────────
// Search & Filter
// ─────────────────────────────────────────────────────────────

export interface SearchSummary {
  total_searches: number;
  zero_results: number;
  zero_result_pct: number;
  unique_queries: number;
  top_city: {
    city_slug: string;
    city_title: string;
    city_id: number | string | null;
    search_count: number;
  } | null;
}

export interface SearchCityStat {
  city_slug: string;
  city_title: string;
  city_id: number | string | null;
  search_count: number;
}

export interface SearchRow {
  id: number;
  query: string;
  city_slug: string | null;
  city_id: number | null;
  tab: string | null;
  trigger: string | null;
  results_count: number;
  total_properties: number;
  created_at: string;
}

export interface FilterRow {
  id: number;
  filters: Array<{ key: string; value: string }>;
  filters_count: number;
  city_slug: string | null;
  category_slug: string | null;
  results_count: number;
  returned_count: number;
  is_reset: boolean;
  created_at: string;
}

export interface SearchFilterResponse {
  summary: SearchSummary;
  top_cities: SearchCityStat[];
  last_searches: SearchRow[];
  last_filters: FilterRow[];
}

// ─────────────────────────────────────────────────────────────
// User Journeys
// ─────────────────────────────────────────────────────────────

export interface UserJourneySummary {
  total_users: number;
  navigated_count: number;
  navigated_pct: number;
  called_count: number;
  called_pct: number;
  intent_count: number;
  intent_pct: number;
  searched_count: number;
  searched_pct: number;
}

export interface TimelineEvent {
  type: "event";
  event_name: string;
  count: number;
  label: string;
  created_at: string;
  payload?: Record<string, unknown>;   // full payload
}

export interface TimelineGap {
  type: "gap";
  gap_seconds: number;
  gap_hours: number;
  is_return: boolean;
  created_at: string;
}

export type TimelineItem = TimelineEvent | TimelineGap;

export interface UserJourney {
  anonymous_id: string;
  event_count: number;
  visit_count: number;
  duration_seconds: number;
  started_at: string;
  ended_at: string;
  last_page: string;
  has_navigated: boolean;
  has_call: boolean;
  has_intent: boolean;
  has_search: boolean;
  has_filter: boolean;
  timeline: TimelineItem[];
}

export interface UserJourneysResponse {
  summary: UserJourneySummary;
  journeys: UserJourney[];
}