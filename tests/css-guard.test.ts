import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const cssFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? cssFiles(path) : path.endsWith(".css") ? [path] : [];
  });

/** CSS text without comments and without @supports conditions, which may name animation-timeline themselves. */
const clean = (css: string) =>
  css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@supports[^{]*/g, "@supports ");

/** The text of every `@media (prefers-reduced-motion: no-preference) { … }` block, and the file without them. */
function splitGuarded(css: string) {
  const guarded: string[] = [];
  let rest = "";
  let from = 0;
  for (const match of css.matchAll(/@media[^{]*prefers-reduced-motion:\s*no-preference[^{]*\{/g)) {
    const start = match.index ?? 0;
    if (start < from) continue;
    let depth = 1;
    let at = start + match[0].length;
    for (; depth && at < css.length; at++) {
      if (css[at] === "{") depth++;
      else if (css[at] === "}") depth--;
    }
    rest += css.slice(from, start);
    guarded.push(css.slice(start, at));
    from = at;
  }
  return { guarded: guarded.join("\n"), rest: rest + css.slice(from) };
}

describe("motion safety", () => {
  const files = cssFiles(join(process.cwd(), "src"));
  const allCss = files.map((file) => clean(readFileSync(file, "utf8"))).join("\n");

  it("defines the shared motion tokens", () => {
    const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(globals).toMatch(/--dur-1:\s*150ms/);
    expect(globals).toMatch(/--dur-2:\s*250ms/);
  });

  // DESIGN.md (Motion): scroll-linked motion may move or draw things, never reveal them. Reveals hid headings and
  // entries from anything that does not scroll, so a scroll-driven keyframe may not touch opacity, visibility,
  // clipping or filters, and all of it sits behind prefers-reduced-motion: no-preference.
  it("keeps scroll-linked motion to transforms and line drawing, behind reduced motion", () => {
    const allowed = new Set(["transform", "translate", "scale", "stroke-dashoffset"]);
    const problems: string[] = [];
    for (const file of files) {
      const { guarded, rest } = splitGuarded(clean(readFileSync(file, "utf8")));
      if (/animation-timeline\s*:/.test(rest))
        problems.push(`${file}: animation-timeline outside prefers-reduced-motion: no-preference`);
      const declared = [...guarded.matchAll(/animation-timeline\s*:/g)].length;
      const rules = [...guarded.matchAll(/\{([^{}]*animation-timeline\s*:[^{}]*)\}/g)];
      // A declaration the rule pattern cannot see (e.g. inside a nested rule) would go unchecked: refuse it.
      if (rules.length !== declared)
        problems.push(
          `${file}: ${declared - rules.length} animation-timeline declaration(s) the guard cannot read`,
        );
      for (const [, rule] of rules) {
        const names = rule
          .match(/animation-name\s*:\s*([^;}]+)/)?.[1]
          .split(",")
          .map((n) => n.trim());
        if (!names?.length) problems.push(`${file}: scroll-linked rule needs an animation-name`);
        for (const name of names ?? []) {
          const frames = allCss.match(
            new RegExp(`@keyframes\\s+${name}\\s*\\{((?:[^{}]*\\{[^{}]*\\})*)[^{}]*\\}`),
          )?.[1];
          if (!frames) problems.push(`${file}: no @keyframes ${name}`);
          for (const [, property] of frames?.matchAll(/([\w-]+)\s*:/g) ?? [])
            if (!allowed.has(property))
              problems.push(`${file}: @keyframes ${name} animates ${property}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("the guard itself catches an unguarded or hiding scroll-linked rule", () => {
    const unguarded = ".x { animation-name: rule-draw; animation-timeline: view(); }";
    expect(/animation-timeline\s*:/.test(splitGuarded(clean(unguarded)).rest)).toBe(true);
    const guarded = `@media (prefers-reduced-motion: no-preference) { @supports (animation-timeline: view()) { ${unguarded} } }`;
    const split = splitGuarded(clean(guarded));
    expect(/animation-timeline\s*:/.test(split.rest)).toBe(false);
    expect([...split.guarded.matchAll(/animation-timeline\s*:/g)].length).toBe(1);
  });
});

describe("legibility", () => {
  // The services shelf shows each sample's cover at thumbnail scale with `zoom`: an aria-hidden picture of a page whose readable
  // version is the dialog, so zoomed thumbnails are exempt by design (DESIGN.md, Services).
  const screenCss = cssFiles(join(process.cwd(), "src"));

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
