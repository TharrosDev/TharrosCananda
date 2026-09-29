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

for (const path of [
  "/",
  "/research",
  "/methodology",
  "/about",
  "/privacy",
  "/accessibility",
  "/sitemap.xml",
  "/robots.txt",
]) {
  const response = await get(base + path, { redirect: "manual" });
  check(response.status === 200, `${path} -> ${response.status}`);
}

for (const [path, destination] of [
  ["/ecommerce-readiness", "/research"],
  ["/research-services", "/research"],
  ["/request-research", "/research"],
  ["/how-it-works", "/methodology"],
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

const headers = (await get(base)).headers;
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
