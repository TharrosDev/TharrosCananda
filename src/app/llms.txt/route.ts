import { publications } from "@/data/publications";
import { publishing } from "@/data/publishing";
import { publicSources } from "@/data/sources";
import { researchAreas } from "@/lib/research-areas";
import { siteUrl } from "@/lib/site";

// llms.txt (llmstxt.org): a plain summary for AI assistants and answer engines, built from the same
// data as the pages so it never drifts from the site.
export const dynamic = "force-static";

export function GET() {
  const published = publications.filter((p) => p.indexable);
  const lines = [
    `# ${publishing.name}`,
    "",
    `> ${publishing.description}`,
    "",
    "## Launch status",
    "",
    "The platform is preparing for launch, initially for Canadian undergraduate students. Submissions and pricing are forthcoming. The site does not currently accept uploads, submissions or payments. Publication is subject to editorial screening; acceptance is not guaranteed. Tharros does not claim university affiliation or accredited academic credentials.",
    "",
    "## Publications",
    "",
    ...(published.length
      ? published.map(
          (p) =>
            `- [${p.title}](${siteUrl}/research/${p.slug}) (${p.type}, ${p.publishedAt}): ${p.summary}`,
        )
      : [
          "No publications are currently approved for public indexing. Existing reports available by link are omitted from this listing.",
        ]),
    "",
    "## Key pages",
    "",
    `- [Publications](${siteUrl}/research): searchable publication archive`,
    `- [How it works](${siteUrl}/how-it-works): the planned submission, review, revision and publication process`,
    `- [Submission guidelines](${siteUrl}/submit): eligible undergraduate work, requirements and forthcoming submissions and pricing`,
    `- [About](${siteUrl}/about): publishing mission and editorial contact`,
    `- [Sources & methodology](${siteUrl}/methodology): source selection, verification and limitations`,
    `- [Copyright & licence](${siteUrl}/copyright): existing research licences and forthcoming author terms`,
    "",
    "## Existing research areas",
    "",
    ...researchAreas.map((a) => `- ${a.name}: ${a.scope}`),
    `- [Research areas](${siteUrl}/research-areas): context for the existing Canada–Europe research collection`,
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
