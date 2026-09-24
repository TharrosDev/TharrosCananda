import type { TraceField } from "@/components/provenance-trace";

/**
 * The worked example on /methodology: passages quoted verbatim from TC-2026-001's PDF (line breaks joined, footnote
 * markers left out) and the phrases in them that the trace ties to the provenance record. tests/methodology.test.ts
 * checks every passage against the extracted report text, so an edit here cannot drift from what the report says.
 */
export const traceReference = "TC-2026-001";

export const tracePassages = [
  {
    source: "Overview",
    text: "Published August 14, 2026, Traffic Collisions by Location 2017-2024 (excluding 2023) is a dataset collected and maintained by the City of Ottawa, provided to the public under the Open Data Licence Version 2.0, detailing all traffic collisions between 2017-2024 (excluding 2023) in the Ottawa region. A total of 94,406 traffic incidents were documented.",
  },
  {
    source: "Fit for Use Assessment",
    text: "While the dataset is well suited for identifying broader collision trends across Ottawa, the absence of 2023 limits its reliability for continuous analysis and weakens any findings and conclusions that depend on complete 2017 to 2024 comparisons.",
  },
  {
    source: "Footnote 1",
    text: "City of Ottawa, “Traffic Collisions by Location 2017–2024 (excluding 2023),” Open Ottawa, accessed September 13, 2026.",
  },
] as const;

/** In reading order within each passage; each must appear in exactly one passage. */
export const tracePhrases: { text: string; fields: TraceField[] }[] = [
  { text: "Traffic Collisions by Location 2017-2024 (excluding 2023)", fields: ["dataset"] },
  { text: "the City of Ottawa", fields: ["publisher"] },
  { text: "the Open Data Licence Version 2.0", fields: ["licence"] },
  { text: "between 2017-2024 (excluding 2023)", fields: ["period"] },
  { text: "94,406 traffic incidents", fields: ["dataset"] },
  { text: "the absence of 2023 limits its reliability for continuous analysis", fields: ["notes"] },
  { text: "accessed September 13, 2026", fields: ["retrieved"] },
];
