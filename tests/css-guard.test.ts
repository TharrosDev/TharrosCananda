import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const cssFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? cssFiles(path) : path.endsWith(".css") ? [path] : [];
  });

describe("motion safety", () => {
  const files = cssFiles(join(process.cwd(), "src"));

  it("defines the shared motion tokens", () => {
    const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(globals).toMatch(/--dur-1:\s*150ms/);
    expect(globals).toMatch(/--dur-2:\s*250ms/);
  });

  // DESIGN.md: no scroll-triggered reveals. They hid headings and entries from anything that does not scroll.
  it("uses no scroll-driven reveals", () => {
    const reveals = files.filter((file) => /animation-timeline\s*:/.test(readFileSync(file, "utf8")));
    expect(reveals).toEqual([]);
  });
});

describe("legibility", () => {
  // report.css shapes the printed PDF (fixed page scale), so the screen minimum does not apply there.
  const screenCss = cssFiles(join(process.cwd(), "src")).filter((file) => !file.endsWith("report.css"));

  it("never sets screen type below the 11.5px label minimum", () => {
    const small: string[] = [];
    for (const file of screenCss) {
      const css = readFileSync(file, "utf8");
      for (const match of css.matchAll(/font(?:-size)?:[^;}]*?(\d+(?:\.\d+)?)px/g)) {
        if (Number(match[1]) < 11.5) small.push(`${file}: ${match[0]}`);
      }
    }
    expect(small).toEqual([]);
  });
});
