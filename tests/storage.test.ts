import { describe, expect, it, vi } from "vitest";
import { readStorage, removeStorage, writeStorage } from "../src/lib/storage";

describe("storage", () => {
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
