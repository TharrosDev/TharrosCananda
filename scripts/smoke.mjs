// Deployment smoke test: node scripts/smoke.mjs https://tharros.ca
// Read-only apart from one deliberately invalid intake POST, which is rejected (422) and never forwarded.
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};

for (const path of [
  "/",
  "/research",
  "/research-services",
  "/live-monitor",
  "/how-it-works",
  "/methodology",
  "/about",
  "/privacy",
  "/accessibility",
  "/request-research",
  "/sitemap.xml",
  "/robots.txt",
]) {
  const response = await fetch(base + path, { redirect: "manual" });
  check(response.status === 200, `${path} -> ${response.status}`);
}

const legacy = await fetch(`${base}/ecommerce-readiness`, { redirect: "manual" });
check(legacy.status === 308, `/ecommerce-readiness -> ${legacy.status} (expected 308)`);

const monitor = await fetch(`${base}/live-monitor`).then((response) => response.text());
const coverage = monitor.includes("Currents") && monitor.includes("Open original");
const monitorFailedClosed = monitor.includes("Live coverage is temporarily unavailable");
check(
  coverage || monitorFailedClosed,
  `/live-monitor shows ${coverage ? "attributed coverage" : monitorFailedClosed ? "the explicit unavailable state" : "neither coverage nor the unavailable state"}`,
);
if (monitorFailedClosed) console.log("     note: Currents was unavailable from this deployment");

const intake = await fetch(`${base}/api/research-request`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ consent: false }),
});
check(
  intake.status === 422,
  `POST /api/research-request (invalid) -> ${intake.status}, expected 422`,
);

const headers = (await fetch(base)).headers;
for (const name of [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "strict-transport-security",
])
  check(headers.has(name), `header ${name}`);

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll smoke checks passed.");
