// Generates committed report PDFs from the print surface. Usage: npm run build && npm run report:pdf -- <slug> [...]
// Vercel builds cannot run Chromium, so artifacts are committed; tests/report-pdf.test.ts fails when they go stale.
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: npm run report:pdf -- <slug> [...slugs]");
  process.exit(1);
}

const port = 3300;
const base = `http://127.0.0.1:${port}`;
// Run next directly (no shell) so killing the child stops the server; a stale server would print an old build.
const server = spawn(process.execPath, [join("node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port), "-H", "127.0.0.1"], { stdio: "ignore" });

async function waitForServer() {
  try {
    await fetch(base);
    throw new Error(`Port ${port} is already in use; stop that server first.`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Port")) throw error;
  }
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("next start did not come up; run npm run build first.");
}

async function extract(bytes) {
  const doc = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const content = await (await doc.getPage(n)).getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : "")).join("");
    pages.push(text.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").trim());
  }
  const outline = ((await doc.getOutline()) ?? []).length > 0;
  await doc.cleanup();
  return { pages, outline };
}

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n");

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const manifestPath = join("src", "data", "report-pdf.json");
  const textPath = join("src", "data", "report-text.json");
  const manifest = await readJson(manifestPath);
  const texts = await readJson(textPath);
  await mkdir(join("public", "research"), { recursive: true });

  for (const slug of slugs) {
    // Print media for everything below: page.pdf, the cover screenshot and the @media print rules.
    await page.emulateMedia({ media: "print" });
    await page.setViewportSize({ width: 816, height: 1056 });
    const response = await page.goto(`${base}/research/${slug}/print`, { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`/research/${slug}/print returned ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const meta = await page.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll('meta[name^="report-"]')].map((m) => [m.getAttribute("name").slice(7), m.getAttribute("content")]),
      ),
    );

    const printed = await page.pdf({ printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
    const pdf = await PDFDocument.load(printed, { updateMetadata: false });
    // A fixed date keeps regenerated files stable for the same content.
    const stamp = new Date(`${meta.published}T00:00:00Z`);
    pdf.setTitle(meta.title, { showInWindowTitleBar: true });
    pdf.setAuthor(JSON.parse(meta.authors).join(", "));
    pdf.setSubject(meta.abstract);
    pdf.setKeywords([meta.reference, ...meta.keywords.split(",").map((k) => k.trim()).filter(Boolean)]);
    pdf.setCreator("Tharros Canada");
    pdf.setProducer("Tharros Canada report pipeline");
    pdf.setLanguage("en-CA");
    pdf.setCreationDate(stamp);
    pdf.setModificationDate(stamp);
    const bytes = await pdf.save();

    const file = `/research/${meta.reference}.pdf`;
    const cover = `/research/${meta.reference}-cover.jpg`;
    await writeFile(join("public", file), bytes);

    // Cover thumbnail: the first Letter-sized page as printed (816 x 1056 CSS px).
    await page.screenshot({ path: join("public", cover), type: "jpeg", quality: 82, clip: { x: 0, y: 0, width: 816, height: 1056 } });

    const { pages, outline } = await extract(bytes);
    texts[slug] = pages;
    manifest[slug] = { file, cover, pages: pages.length, bytes: bytes.length, sha: meta.sha, outline };
    console.log(`${slug}: ${pages.length} pages, ${bytes.length} bytes, outline ${outline}`);
  }

  await writeJson(manifestPath, manifest);
  await writeJson(textPath, texts);
  await browser.close();
} finally {
  server.kill();
}
