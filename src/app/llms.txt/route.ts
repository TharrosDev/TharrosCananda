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
    "Tharros combines a research repository, professional portfolio and LinkedIn-style referencing profiles displaying authored works. Students can share stable publication and profile links in résumés, applications and portfolios. New student submissions are forthcoming; the site does not currently accept uploads or payments, or offer self-service account creation. Publication is subject to screening. Tharros does not claim university affiliation or accredited academic credentials.",
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
    `- [Research database](${siteUrl}/research): searchable academic work with citations, original PDFs and stable links`,
    `- [How it works](${siteUrl}/how-it-works): prepare, review, publish and showcase student work`,
    `- [Showcase your work](${siteUrl}/submit): eligible undergraduate work, preparation guidance and forthcoming submissions`,
    `- [About](${siteUrl}/about): showcase mission and editorial contact`,
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
