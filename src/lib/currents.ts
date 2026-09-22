import {
  monitorTopics,
  type MonitorArticle,
  type MonitorTopicId,
} from "@/lib/live-monitor";

export const CURRENTS_API_BASE_URL = "https://api.currentsapi.services";
const SEARCH_PATH = "/v2/search";
const FETCH_TIMEOUT_MS = 10_000;
const PREFERRED_PAGE_SIZE = 100;
const SAFE_PAGE_SIZE = 30;

const EUROPE_TERMS = [
  '"European Union"', "Europe", "European", "EU",
  "Germany", "German", "France", "French", "Italy", "Italian",
  "Spain", "Spanish", "Poland", "Polish", "Netherlands", "Dutch",
  "Belgium", "Belgian", "Sweden", "Swedish", "Finland", "Finnish",
  "Denmark", "Danish", "Norway", "Norwegian", '"United Kingdom"',
  "Britain", "British", "Ukraine", "Ukrainian",
].join(" OR ");

const SUBJECT_TERMS = [
  "trade", "CETA", "tariff", "investment", "economy", "business",
  "defence", "defense", "NATO", "security", "procurement",
  "energy", '"critical minerals"', "mining", "manufacturing", "industry",
  "technology", '"artificial intelligence"', "AI", "cyber",
  "semiconductor", "telecom", "space",
].join(" OR ");

type CurrentsArticle = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  url?: unknown;
  language?: unknown;
  category?: unknown;
  published?: unknown;
};

type CurrentsPayload = {
  status?: unknown;
  news?: unknown;
  page?: unknown;
  next_cursor?: unknown;
  message?: unknown;
  msg?: unknown;
};

type CurrentsOptions = {
  fetcher?: typeof fetch;
  baseUrl?: string;
  apiKey?: string;
  now?: () => Date;
  timeoutMs?: number;
};

export class CurrentsError extends Error {
  constructor(
    message: string,
    readonly code: "not-configured" | "unauthorized" | "quota" | "upstream" | "invalid-response",
    readonly status?: number,
  ) {
    super(message);
    this.name = "CurrentsError";
  }
}

function clean(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function cleanUrl(value: unknown) {
  const text = clean(value);
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || ["fbclid", "gclid", "mc_cid", "mc_eid"].includes(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return null;
  }
}

function parsePublished(value: unknown) {
  const text = clean(value);
  if (!text) return null;

  const currentsFormat = text.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([+-])(\d{2})(\d{2})$/);
  const normalized = currentsFormat
    ? currentsFormat[1] + "T" + currentsFormat[2] + currentsFormat[3] + currentsFormat[4] + ":" + currentsFormat[5]
    : text;
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function stableId(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0).toString(36);
}

function categoryText(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join(" ") : "";
}

export function inferCurrentsTopics(title: string, description: string, categories: string): MonitorTopicId[] {
  const value = " " + [title, description, categories.replaceAll("_", " ")].join(" ").toLowerCase() + " ";
  const matched = monitorTopics
    .filter((topic) => topic.matchKeywords.some((keyword) => value.includes(keyword)))
    .map((topic) => topic.id);

  if (categories.includes("economy_business_finance") && !matched.includes("trade-economy")) matched.push("trade-economy");
  if (categories.includes("science_technology") && !matched.includes("technology-strategic")) matched.push("technology-strategic");
  if (categories.includes("environment") && !matched.includes("energy-industry")) matched.push("energy-industry");
  return matched;
}

export function buildCurrentsQuery() {
  return '(Canada OR Canadian) AND (' + EUROPE_TERMS + ') AND (' + SUBJECT_TERMS + ')';
}

export function parseCurrentsPayload(payload: unknown): MonitorArticle[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new CurrentsError("Currents returned an unexpected response.", "invalid-response");
  }

  const object = payload as CurrentsPayload;
  if (object.status !== "ok") {
    throw new CurrentsError(clean(object.message) || clean(object.msg) || "Currents returned an error response.", "invalid-response");
  }
  if (!Array.isArray(object.news)) {
    throw new CurrentsError("Currents response did not include a news array.", "invalid-response");
  }

  const seen = new Set<string>();
  const articles: MonitorArticle[] = [];

  for (const raw of object.news as CurrentsArticle[]) {
    if (!raw || typeof raw !== "object") continue;
    const url = cleanUrl(raw.url);
    const title = clean(raw.title);
    const description = clean(raw.description);
    const publishedAt = parsePublished(raw.published);
    if (!url || !title || !publishedAt || seen.has(url)) continue;
    seen.add(url);

    const categories = categoryText(raw.category);
    articles.push({
      id: clean(raw.id) || stableId(url),
      title,
      description,
      url,
      domain: new URL(url).hostname.replace(/^www\./, ""),
      language: clean(raw.language) || "Not supplied",
      publishedAt,
      topics: inferCurrentsTopics(title, description, categories),
    });
  }

  return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

function formatDate(date: Date) {
  return date.toISOString();
}

async function requestCurrents(
  pageSize: number,
  options: CurrentsOptions,
) {
  const apiKey = options.apiKey ?? process.env.CURRENTS_API_KEY;
  if (!apiKey) throw new CurrentsError("Currents API key is not configured.", "not-configured");

  const baseUrl = options.baseUrl ?? process.env.CURRENTS_API_BASE_URL ?? CURRENTS_API_BASE_URL;
  const now = options.now ?? (() => new Date());
  const fetcher = options.fetcher ?? fetch;
  const timeoutMs = options.timeoutMs ?? FETCH_TIMEOUT_MS;

  const end = now();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const url = new URL(SEARCH_PATH, baseUrl);
  url.searchParams.set("query", buildCurrentsQuery());
  url.searchParams.set("language", "en");
  url.searchParams.set("type", "1");
  url.searchParams.set("start_date", formatDate(start));
  url.searchParams.set("end_date", formatDate(end));
  url.searchParams.set("page_number", "1");
  url.searchParams.set("page_size", String(pageSize));

  const response = await fetcher(url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + apiKey,
    },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });

  const body = await response.text();
  let payload: unknown = null;
  if (body.trim()) {
    try {
      payload = JSON.parse(body);
    } catch {
      if (response.ok) throw new CurrentsError("Currents returned non-JSON content.", "invalid-response", response.status);
    }
  }

  if (!response.ok) {
    const message = payload && typeof payload === "object"
      ? clean((payload as CurrentsPayload).message) || clean((payload as CurrentsPayload).msg)
      : "";
    if (response.status === 401 || response.status === 403) {
      throw new CurrentsError(message || "Currents rejected the API key.", "unauthorized", response.status);
    }
    if (response.status === 429) {
      throw new CurrentsError(message || "Currents API quota has been reached.", "quota", response.status);
    }
    throw new CurrentsError(message || "Currents returned HTTP " + response.status + ".", "upstream", response.status);
  }

  return {
    retrievedAt: end.toISOString(),
    articles: parseCurrentsPayload(payload),
  };
}

export async function fetchCurrentsMonitor(options: CurrentsOptions = {}) {
  try {
    return await requestCurrents(PREFERRED_PAGE_SIZE, options);
  } catch (error) {
    if (error instanceof CurrentsError && error.status === 400) {
      return requestCurrents(SAFE_PAGE_SIZE, options);
    }
    throw error;
  }
}
