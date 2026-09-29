import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/app/api/research-request/route";

afterEach(() => vi.unstubAllGlobals());

describe("retired research request endpoint", () => {
  it("returns 410 for former submissions without forwarding their contents", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = POST();
    expect(response.status).toBe(410);
    expect(await response.text()).toContain("no longer accepted");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
