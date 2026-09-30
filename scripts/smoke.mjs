// Deployment smoke test: node scripts/smoke.mjs https://tharros.ca
// Read-only apart from one POST to the retired intake endpoint, which must return 410.
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
// A hung deployment must fail the smoke run, not stall it.
const get = (url, init = {}) => fetch(url, { signal: AbortSignal.timeout(15_000), ...init });
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};

// Fixed fixtures keep deployment checks bounded as the publication archive grows.
const reportPath = "/research/ottawa-traffic-collisions-2017-2024";
const referencePath = "/research/id/TC-2026-001";
const pdfPath = "/research/TC-2026-001.pdf";
const authorPath = "/authors/magnus-abdelnour";
const pages = new Map();
const visibleText = (html) =>
  html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
const metaContent = (html, name) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = Object.fromEntries(
      [...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map((match) => [
        match[1].toLowerCase(),
        match[3],
      ]),
    );
    if (attrs.name?.toLowerCase() === name) return attrs.content ?? "";
  }
  return "";
};
const isUnindexed = (value) =>
  /\bnoindex\b/i.test(value ?? "") && /\bnofollow\b/i.test(value ?? "");

for (const path of [
  "/",
  "/research",
  "/how-it-works",
  "/submit",
  "/methodology",
  "/about",
  "/privacy",
  "/accessibility",
  "/copyright",
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
  authorPath,
  reportPath,
]) {
  const response = await get(base + path, { redirect: "manual" });
  check(response.status === 200, `${path} -> ${response.status}`);
  pages.set(path, { response, body: await response.text() });
}

const home = pages.get("/");
const about = visibleText(pages.get("/about").body);
const submission = visibleText(pages.get("/submit").body);
const plannedProcessText = visibleText(pages.get("/how-it-works").body);
const llms = pages.get("/llms.txt").body;
const sitemap = pages.get("/sitemap.xml").body;
check(
  metaContent(home.body, "description").includes(
    "Tharros Undergraduate Publishing transforms strong undergraduate work",
  ) && visibleText(home.body).includes("looks better when"),
  "home publishing identity and value proposition",
);
check(
  about.includes("Give strong undergraduate work somewhere to go after the grade.") &&
    about.includes("Canadian university students"),
  "About publishing mission and initial audience",
);
check(
  submission.includes("Submissions forthcoming") &&
    submission.includes("Pricing forthcoming") &&
    submission.includes("Submissions are not open yet"),
  "submission and pricing forthcoming",
);
check(
  !/<form\b/i.test(pages.get("/submit").body) &&
    !/<input\b[^>]*\btype\s*=\s*["']file["']/i.test(pages.get("/submit").body),
  "submission guidance has no active intake form or upload",
);
check(
  plannedProcessText.includes("Preparing for launch") &&
    plannedProcessText.includes("intake is not open yet") &&
    ["Submit", "Screening", "Decision", "Payment", "Preparation", "Publish"].every((stage) =>
      plannedProcessText.includes(stage),
    ),
  "How it works shows the planned process and closed intake",
);
check(
  llms.startsWith("# Tharros Undergraduate Publishing") &&
    llms.includes("Submissions and pricing are forthcoming.") &&
    !llms.includes(reportPath) &&
    !llms.includes(pdfPath) &&
    !llms.includes(authorPath),
  "llms launch summary excludes unindexed fixtures",
);
check(
  sitemap.includes("/submit</loc>") &&
    sitemap.includes("/how-it-works</loc>") &&
    !sitemap.includes(reportPath) &&
    !sitemap.includes(pdfPath) &&
    !sitemap.includes(authorPath),
  "sitemap discovers launch pages and excludes unindexed fixtures",
);
for (const [path, label] of [
  [authorPath, "author profile"],
  [reportPath, "existing report"],
]) {
  const { body, response } = pages.get(path);
  check(isUnindexed(metaContent(body, "robots")), `${label} robots remain noindex, nofollow`);
  if (path === reportPath)
    check(
      isUnindexed(response.headers.get("x-robots-tag")),
      "existing report X-Robots-Tag remains noindex, nofollow",
    );
}

const reference = await get(base + referencePath, { redirect: "manual" });
check(
  reference.status === 308 && reference.headers.get("location") === reportPath,
  "TC-2026-001 stable reference redirects to its original report",
);
check(
  isUnindexed(reference.headers.get("x-robots-tag")),
  "TC-2026-001 stable reference remains noindex, nofollow",
);
const pdf = await get(base + pdfPath, { method: "HEAD", redirect: "manual" });
check(
  pdf.status === 200 && pdf.headers.get("content-type")?.includes("application/pdf"),
  "TC-2026-001 original PDF is available",
);
check(isUnindexed(pdf.headers.get("x-robots-tag")), "TC-2026-001 PDF remains noindex, nofollow");

for (const [path, destination] of [
  ["/ecommerce-readiness", "/research"],
  ["/research-services", "/research"],
  ["/request-research", "/research"],
]) {
  const legacy = await get(base + path, { redirect: "manual" });
  check(
    legacy.status === 308 && legacy.headers.get("location") === destination,
    `${path} -> ${legacy.status} ${legacy.headers.get("location")}, expected 308 ${destination}`,
  );
}

const intake = await get(`${base}/api/research-request`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ consent: false }),
});
check(intake.status === 410, `POST /api/research-request -> ${intake.status}, expected 410`);

const headers = home.response.headers;
for (const name of [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "strict-transport-security",
  "content-security-policy",
  "permissions-policy",
])
  check(headers.has(name), `header ${name}`);

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll smoke checks passed.");
