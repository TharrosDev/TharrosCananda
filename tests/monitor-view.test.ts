import { describe, expect, it, vi } from "vitest";
import type { MonitorArticle } from "../src/lib/live-monitor";
import {
  filterArticles,
  groupByDay,
  highlightSegments,
  newSince,
  parseMonitorState,
  readStorage,
  removeStorage,
  serializeMonitorState,
  topicVolume,
  topSources,
  writeStorage,
} from "../src/lib/monitor-view";

const ref = Date.parse("2026-09-22T18:00:00Z"); // 14:00 in Toronto
const article = (id: string, hoursAgo: number, over: Partial<MonitorArticle> = {}): MonitorArticle => ({
  id,
  title: `Story ${id}`,
  description: "",
  url: `https://${id}.example/story`,
  domain: `${id}.example`,
  language: "en",
  publishedAt: new Date(ref - hoursAgo * 3_600_000).toISOString(),
  topics: [],
  ...over,
});
const articles = [
  article("a", 1, { topics: ["trade-economy"], domain: "trade.example", title: "Tariff talks (NATO) resume" }),
  article("b", 3, { topics: ["defence-security"], domain: "defence.example" }),
  article("c", 20, { topics: ["trade-economy", "energy-industry"], domain: "trade.example" }),
  article("d", 50, { topics: ["technology-strategic"], domain: "tech.example" }),
  article("e", 100, { topics: ["defence-security"], domain: "defence.example" }),
];
const defaults = { q: "", topics: [], sources: [], window: "7d", view: "editorial" };

describe("monitor URL state", () => {
  it("drops unknown topics, sources, windows and views", () => {
    const state = parseMonitorState(new URLSearchParams("topics=nope,trade-economy&sources=evil.com,trade.example&window=9y&view=grid"), ["trade.example"]);
    expect(state).toEqual({ ...defaults, topics: ["trade-economy"], sources: ["trade.example"] });
  });

  it("round-trips and omits defaults", () => {
    const state = { q: "nato", topics: ["defence-security" as const], sources: ["defence.example"], window: "72h" as const, view: "compact" as const };
    expect(parseMonitorState(new URLSearchParams(serializeMonitorState(state)), ["defence.example"])).toEqual(state);
    expect(serializeMonitorState(defaults as never)).toBe("");
  });
});

describe("filtering", () => {
  it("ORs topics, ORs sources, applies the window and the query", () => {
    const s = (over: object) => ({ ...defaults, ...over }) as never;
    expect(filterArticles(articles, s({ topics: ["trade-economy", "technology-strategic"] }), ref).map((a) => a.id)).toEqual(["a", "c", "d"]);
    expect(filterArticles(articles, s({ sources: ["defence.example"] }), ref).map((a) => a.id)).toEqual(["b", "e"]);
    expect(filterArticles(articles, s({ window: "24h" }), ref).map((a) => a.id)).toEqual(["a", "b", "c"]);
    expect(filterArticles(articles, s({ q: "TARIFF" }), ref).map((a) => a.id)).toEqual(["a"]);
  });
});

describe("grouping and context", () => {
  it("groups by calendar day in Toronto, newest first", () => {
    const groups = groupByDay(articles, "America/Toronto", ref);
    expect(groups.map((g) => g.label)).toEqual(["Today", "Yesterday", "Sep 20", "Sep 18"]);
    expect(groups[0].items.map((a) => a.id)).toEqual(["a", "b"]);
  });

  it("marks nothing new on a first visit, and only newer stories after", () => {
    expect(newSince(articles, null).size).toBe(0);
    expect([...newSince(articles, ref - 4 * 3_600_000)].sort()).toEqual(["a", "b"]);
  });

  it("counts topic volume per day, oldest to newest", () => {
    const volume = topicVolume(articles, ref, 7);
    expect(volume["defence-security"]).toHaveLength(7);
    expect(volume["defence-security"].at(-1)).toBe(1);
    expect(volume["trade-economy"].reduce((a, b) => a + b, 0)).toBe(2);
  });

  it("ranks top sources", () => {
    expect(topSources(articles, 2)).toEqual([
      { domain: "defence.example", count: 2 },
      { domain: "trade.example", count: 2 },
    ]);
  });
});

describe("highlighting and storage", () => {
  it("splits literally, even with regex characters", () => {
    expect(highlightSegments("Tariff talks (NATO) resume", "(nato")).toEqual([
      { text: "Tariff talks ", match: false },
      { text: "(NATO", match: true },
      { text: ") resume", match: false },
    ]);
    expect(highlightSegments("abc", "")).toEqual([{ text: "abc", match: false }]);
  });

  it("never throws when storage is blocked", () => {
    const original = globalThis.localStorage;
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } });
    expect(readStorage("k")).toBeNull();
    expect(() => writeStorage("k", "v")).not.toThrow();
    vi.stubGlobal("localStorage", original);
  });

  it("reads, writes and removes session storage, and never throws when it is blocked", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("sessionStorage", { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) });
    writeStorage("draft", "{}", "session");
    expect(readStorage("draft", "session")).toBe("{}");
    removeStorage("draft", "session");
    expect(readStorage("draft", "session")).toBeNull();
    const blocked = () => { throw new Error("blocked"); };
    vi.stubGlobal("sessionStorage", { getItem: blocked, setItem: blocked, removeItem: blocked });
    expect(readStorage("draft", "session")).toBeNull();
    expect(() => writeStorage("draft", "v", "session")).not.toThrow();
    expect(() => removeStorage("draft", "session")).not.toThrow();
    vi.unstubAllGlobals();
  });
});

describe("review fixes", () => {
  it("returns empty volume instead of throwing on an invalid reference time", () => {
    expect(() => topicVolume(articles, Number.NEGATIVE_INFINITY, 7)).not.toThrow();
    expect(topicVolume(articles, Number.NEGATIVE_INFINITY, 7)["trade-economy"]).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });
});
