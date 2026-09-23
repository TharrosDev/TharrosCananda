import { afterEach, describe, expect, it, vi } from "vitest";

async function csp(vercelEnv: string) {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VERCEL_ENV", vercelEnv);
  const { default: config } = await import("../next.config");
  const [all] = await config.headers!();
  return all.headers.find((h) => h.key === "Content-Security-Policy")!.value;
}

describe("Content-Security-Policy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("allows the Vercel toolbar on preview deployments only", async () => {
    const production = await csp("production");
    expect(production).not.toContain("vercel.live");
    expect(production).toContain("script-src 'self' 'unsafe-inline';");

    const preview = await csp("preview");
    expect(preview).toContain("script-src 'self' 'unsafe-inline' https://vercel.live;");
    expect(preview).toContain("frame-src 'self' https://vercel.live");
    expect(preview).toContain("frame-ancestors 'none'");
  });
});
