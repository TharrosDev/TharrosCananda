import { publicationByReference } from "../src/data/publications";

// One fixed, permanent report drives the report and archive tests, so the e2e suite stays the same size however
// many reports are published. Don't loop e2e tests over every publication; per-report checks belong in the
// file-only unit tests (tests/report-pdf.test.ts, tests/publications.test.ts).
export const fixture = publicationByReference("TC-2026-001")!;
export const fixturePath = `/research/${fixture.slug}`;
export const fixturePdf = `/research/${fixture.reference}.pdf`;
/** A word only the fixture's PDF text contains (pages 1 and 3); the archive's fuzzy search matches no other report. */
export const fixtureWord = "ArcGIS";
