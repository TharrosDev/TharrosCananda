import { publications } from "@/data/publications";
import { publicSources } from "@/data/sources";
import { researchAreas } from "@/lib/research-areas";
import { siteUrl } from "@/lib/site";

// llms.txt (llmstxt.org): a plain summary for AI assistants and answer engines, built from the same
// data as the pages so it never drifts from the site.
export const dynamic = "force-static";

export function GET() {
  const published = publications.filter((p) => p.indexable);
  const lines = [
    "# Tharros Canada",
    "",
    "> Independent student research project publishing sourced reports on Canada–Europe policy and industry questions, and assessments of whether public datasets are fit for use. Each report states its sources and material limitations. Tharros is not a government body and does not give legal, tax, regulatory, lobbying or investment advice.",
    "",
    "## Research areas",
    "",
    ...researchAreas.map((a) => `- ${a.name}: ${a.scope}`),
    "",
    "## Published research",
    "",
    ...(published.length
      ? published.map(
          (p) =>
            `- [${p.title}](${siteUrl}/research/${p.slug}) (${p.type}, ${p.publishedAt}): ${p.summary}`,
        )
      : [
          "No research is currently approved for public indexing. Reports available by link are omitted from this listing.",
        ]),
    "",
    "## Key pages",
    "",
    `- [Sources & methodology](${siteUrl}/methodology): source selection, verification, freshness and limitations`,
    `- [Research](${siteUrl}/research): searchable publications`,
    `- [Research areas](${siteUrl}/research-areas): questions across five areas of interest`,
    `- [About](${siteUrl}/about): About, mission, why and contact`,
    `- [Copyright & licence](${siteUrl}/copyright): public research is licensed CC BY 4.0`,
    "",
    "## Optional",
    "",
    ...publicSources.map(
      (s) =>
        `- [${s.publisher}](${s.url}): ${s.purpose} (a source Tharros uses; no affiliation or endorsement)`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
