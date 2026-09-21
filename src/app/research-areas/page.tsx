import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { researchAreas } from "@/lib/research-areas";
import { requestResearchHref } from "@/lib/research-request";

export const metadata: Metadata = {
  title: "Research Areas",
  description: "Trade and economic integration, defence and security, energy and industry, and technology: the four areas Tharros Canada researches between Canada and Europe.",
  alternates: { canonical: "/research-areas" },
};

export default function ResearchAreasPage() {
  return (
    <>
      <PageHero
        title="Four areas, one relationship."
        description="These areas organize both commissioned work and Tharros’s own research. A question can sit across more than one."
      />
      <div className="page-shell area-sections">
        {researchAreas.map((area, index) => (
          <section key={area.slug} id={area.slug} className="area-section" aria-labelledby={`${area.slug}-title`}>
            <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 id={`${area.slug}-title`}>{area.name}</h2>
              <p>{area.scope}</p>
            </div>
            <div>
              <h3>Example questions</h3>
              <ul>{area.questions.map((question) => <li key={question}>{question}</li>)}</ul>
              <Link
                className="text-link"
                href={requestResearchHref({ service: "commissioned-research", context: `Research area: ${area.name}.` })}
              >
                Commission research in this area <ArrowIcon />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
