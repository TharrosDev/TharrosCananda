import { publications } from "@/data/publications";
import { publicSources } from "@/data/sources";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

// llms.txt (llmstxt.org): a plain summary for AI assistants and answer engines, built from the same
// data as the pages so it never drifts from the site.
export const dynamic = "force-static";

export function GET() {
  const published = publications.filter((p) => p.indexable);
  const lines = [
    "# Tharros Canada",
    "",
    "> Independent research firm working across Canada and Europe. Tharros researches trade, defence, energy, industry and technology questions, and publishes assessments of whether public datasets are fit for use, from public, dated and attributed sources, and states the limitations of every finding. Work is commissioned: each engagement is scoped and priced per case, in writing, before it begins. Tharros is not a government body or think tank and does not give legal, tax, regulatory, lobbying or investment advice.",
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.name}](${siteUrl}/research-services#${s.slug}): ${s.question}`),
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
          "No research has been published yet. The archive lists publications as they are released.",
        ]),
    "",
    "## Key pages",
    "",
    `- [Services](${siteUrl}/research-services): the three services and how they are scoped`,
    `- [Commission research](${siteUrl}/request-research): describe a question and receive a written scope, price and timeline`,
    `- [How it works](${siteUrl}/how-it-works): the commissioning process and what Tharros does not provide`,
    `- [Sources & methodology](${siteUrl}/methodology): source selection, verification, freshness and limitations`,
    `- [Research archive](${siteUrl}/research): searchable publications`,
    `- [About](${siteUrl}/about): research principles and independence`,
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
