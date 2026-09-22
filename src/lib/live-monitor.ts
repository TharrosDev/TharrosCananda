export const monitorTopics = [
  {
    id: "trade-economy",
    label: "Trade & Economic Integration",
    shortLabel: "Trade",
    query: '(trade OR CETA OR tariff OR tariffs OR export OR exports OR import OR imports OR investment OR economy OR commerce)',
    matchKeywords: ["trade", "ceta", "tariff", "export", "import", "investment", "economy", "commerce"],
  },
  {
    id: "defence-security",
    label: "Defence & Security",
    shortLabel: "Defence",
    query: '(defence OR defense OR NATO OR military OR security OR procurement OR "defence industry" OR "defense industry")',
    matchKeywords: ["defence", "defense", "nato", "military", "security", "procurement"],
  },
  {
    id: "energy-industry",
    label: "Energy, Resources & Industry",
    shortLabel: "Industry",
    query: '(energy OR "critical minerals" OR mining OR resources OR manufacturing OR industrial OR infrastructure OR hydrogen OR nuclear)',
    matchKeywords: ["energy", "critical mineral", "mining", "manufactur", "industrial", "infrastructure", "hydrogen", "nuclear"],
  },
  {
    id: "technology-strategic",
    label: "Technology & Strategic Industries",
    shortLabel: "Technology",
    query: '(technology OR "artificial intelligence" OR cyber OR cybersecurity OR space OR semiconductor OR semiconductors OR telecom OR digital)',
    matchKeywords: ["technology", "artificial intelligence", "cyber", "space", "semiconductor", "telecom", "digital"],
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
  url: string;
  domain: string;
  sourceCountry: string;
  language: string;
  seenAt: string;
  topics: MonitorTopicId[];
};

export type LiveMonitorSnapshot = {
  kind: "ok" | "partial" | "error";
  articles: MonitorArticle[];
  retrievedAt: string;
  failedTopics: MonitorTopicId[];
  broadFallback: boolean;
  provider: "GDELT";
  coverageWindow: "7 days";
};

export function topicLabel(id: MonitorTopicId) {
  return monitorTopics.find((topic) => topic.id === id)?.label ?? id;
}
