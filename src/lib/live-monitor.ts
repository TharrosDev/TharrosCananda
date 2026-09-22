// Keywords match whole words (plus a plural "s"); a trailing "*" matches any word starting with the stem.
export const monitorTopics = [
  {
    id: "trade-economy",
    label: "Trade & Economic Integration",
    shortLabel: "Trade",
    matchKeywords: ["trade", "ceta", "tariff", "export", "import", "investment", "economy", "economic", "commerce", "business", "finance", "market"],
  },
  {
    id: "defence-security",
    label: "Defence & Security",
    shortLabel: "Defence",
    matchKeywords: ["defence", "defense", "nato", "military", "security", "procurement", "armed forces", "weapon", "aerospace"],
  },
  {
    id: "energy-industry",
    label: "Energy, Resources & Industry",
    shortLabel: "Industry",
    matchKeywords: ["energy", "critical mineral", "mining", "resource", "manufactur*", "industr*", "infrastructure", "hydrogen", "nuclear", "automotive"],
  },
  {
    id: "technology-strategic",
    label: "Technology & Strategic Industries",
    shortLabel: "Technology",
    matchKeywords: ["technology", "artificial intelligence", "ai", "cyber", "space", "semiconductor", "telecom", "digital", "chip", "quantum"],
  },
] as const;

export const monitorWindows = [
  { id: "24h", label: "24 hours", hours: 24 },
  { id: "72h", label: "3 days", hours: 72 },
  { id: "7d", label: "7 days", hours: 168 },
] as const;

export type MonitorTopicId = (typeof monitorTopics)[number]["id"];
export type MonitorWindowId = (typeof monitorWindows)[number]["id"];

export type MonitorArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  domain: string;
  language: string;
  publishedAt: string;
  topics: MonitorTopicId[];
};

export type LiveMonitorErrorCode =
  | "not-configured"
  | "unauthorized"
  | "quota"
  | "invalid-request"
  | "upstream"
  | "invalid-response"
  | null;

export type LiveMonitorSnapshot = {
  kind: "ok" | "error";
  articles: MonitorArticle[];
  retrievedAt: string;
  provider: "Currents";
  coverageWindow: "7 days";
  errorCode: LiveMonitorErrorCode;
};

export function topicLabel(id: MonitorTopicId) {
  return monitorTopics.find((topic) => topic.id === id)?.label ?? id;
}
