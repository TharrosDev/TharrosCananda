// Deployment smoke test: node scripts/smoke.mjs https://tharros.ca
// Read-only apart from one deliberately invalid intake POST, which is rejected (422) and never forwarded.
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
  "/research-services",
  "/how-it-works",
  "/methodology",
  "/about",
  "/privacy",
  "/accessibility",
  "/request-research",
  "/sitemap.xml",
  "/robots.txt",
]) {
  const response = await get(base + path, { redirect: "manual" });
  check(response.status === 200, `${path} -> ${response.status}`);
}

const legacy = await get(`${base}/ecommerce-readiness`, { redirect: "manual" });
check(legacy.status === 308, `/ecommerce-readiness -> ${legacy.status} (expected 308)`);

const intake = await get(`${base}/api/research-request`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ consent: false }),
});
check(
  intake.status === 422,
  `POST /api/research-request (invalid) -> ${intake.status}, expected 422`,
);

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
