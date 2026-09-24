// Reads an author's PDF as supplied and records what the site's tools need from it. Usage: npm run report:pdf -- <slug> [...]
// It never writes the PDF (docs/REPORT_REQUIREMENTS.md, Rule #1); tests/report-pdf.test.ts fails if the file changes afterwards.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import { publications } from "../src/data/publications.ts";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: npm run report:pdf -- <slug> [...slugs]");
  process.exit(1);
}

const records = slugs.map((slug) => {
  const record = publications.find((p) => p.slug === slug);
  if (!record) throw new Error(`No publication with slug ${slug}`);
  return record;
});

async function extract(bytes) {
  const doc = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const content = await (await doc.getPage(n)).getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : "")).join("");
    pages.push(text.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").trim());
  }
  // The PDF's own bookmarks become the on-page contents: title, depth, page and how far down that page it starts.
  const outline = [];
  const walk = async (items, level) => {
    for (const item of items ?? []) {
      const dest = typeof item.dest === "string" ? await doc.getDestination(item.dest) : item.dest;
      if (Array.isArray(dest) && dest[0]) {
        const index = typeof dest[0] === "number" ? dest[0] : await doc.getPageIndex(dest[0]);
        const height = (await doc.getPage(index + 1)).view[3];
        // XYZ destinations carry the target's distance from the page bottom in PDF points.
        const top = dest[1]?.name === "XYZ" && typeof dest[3] === "number" ? Math.min(1, Math.max(0, 1 - dest[3] / height)) : 0;
        outline.push({ title: item.title.trim(), level, page: index + 1, top: Math.round(top * 1000) / 1000 });
      }
      await walk(item.items, level + 1);
    }
  };
  await walk(await doc.getOutline(), 0);
  await doc.cleanup();
  return { pages, outline };
}

const squash = (text) => text.replace(/\s+/g, " ").trim().toLowerCase();

async function ingest(record) {
  const file = `/research/${record.reference}.pdf`;
  const cover = `/research/${record.reference}-cover.jpg`;
  const bytes = await readFile(join("public", file));
  const { pages, outline } = await extract(bytes);
  const words = pages.join(" ").split(/\s+/).filter(Boolean).length;
  // A scan has no text layer: search, find and reading time would all come up empty.
  if (words < 20 * pages.length) throw new Error(`${record.slug}: ${file} has almost no text layer (${words} words). Ask the author for a PDF exported from Word, not a scan.`);
  if (!squash(pages.join(" ")).includes(squash(record.title))) throw new Error(`${record.slug}: the record title does not appear in ${file}. Copy it from the PDF verbatim.`);

  const doc = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: false }).promise;
  const first = await doc.getPage(1);
  const [, , width, height] = first.view;
  // Cover thumbnail 816px wide, the width the viewer and archive expect.
  const viewport = first.getViewport({ scale: 816 / width });
  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  await first.render({ canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
  await writeFile(join("public", cover), await canvas.encode("jpeg", 82));
  await doc.cleanup();

  const sha = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
  return { pages, asset: { file, cover, pages: pages.length, bytes: bytes.length, sha, outline, width, height } };
}

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n");

const manifestPath = join("src", "data", "report-pdf.json");
const textPath = join("src", "data", "report-text.json");
const manifest = await readJson(manifestPath);
const texts = await readJson(textPath);

for (const record of records) {
  const { pages, asset } = await ingest(record);
  texts[record.slug] = pages;
  manifest[record.slug] = asset;
  console.log(`${record.slug}: ${asset.pages} pages, ${asset.bytes} bytes, ${asset.outline.length} outline entries`);
}

await writeJson(manifestPath, manifest);
await writeJson(textPath, texts);
