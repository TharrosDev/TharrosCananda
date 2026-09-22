// Re-records the Statistics Canada WDS fixtures (table 12-10-0174-01) used by unit tests and the Playwright mock.
// Run when the table changes intentionally: node scripts/record-statcan-fixtures.mjs
import { writeFileSync } from "node:fs";

const base = "https://www150.statcan.gc.ca/t1/wds/rest";
const post = async (method, body) => {
  const response = await fetch(`${base}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
  return response.json();
};
const out = (name, json) => writeFileSync(new URL(`../tests/fixtures/statcan/${name}.json`, import.meta.url), JSON.stringify(json));

const metadata = await post("getCubeMetadata", [{ productId: 12100174 }]);
out("getCubeMetadata", metadata);
const cube = metadata[0].object;
const agreement = cube.dimension[2].member.find((member) => /\(CETA\)/.test(member.memberNameEn));
const commodities = cube.dimension[3].member.filter((member) => member.memberId === 1 || member.parentMemberId === 1);
const coordinates = [1, 2].flatMap((flow) => commodities.map((commodity) => `1.${flow}.${agreement.memberId}.${commodity.memberId}.0.0.0.0.0.0`));
const request = (extra) => coordinates.map((coordinate) => ({ productId: 12100174, coordinate, ...extra }));
out("getDataFromCubePidCoordAndLatestNPeriods", await post("getDataFromCubePidCoordAndLatestNPeriods", request({ latestN: 37 })));
out("getSeriesInfoFromCubePidCoord", await post("getSeriesInfoFromCubePidCoord", request({})));
console.log(`Recorded metadata and ${coordinates.length} series.`);
