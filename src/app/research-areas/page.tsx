import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { pageMetadata } from "@/lib/site";
import "./research-areas.css";

export const metadata: Metadata = pageMetadata({
  title: "Research areas",
  description:
    "Explore Tharros Canada's research areas: trade, security, energy, technology and the quality of public evidence.",
  path: "/research-areas",
});

export default function ResearchAreasPage() {
  return (
    <div className="research-areas-page">
      <header className="areas-masthead">
        <h1>Research areas</h1>
        <p>
          Five areas guide the questions Tharros Canada explores. Each report sets its own scope;
          these subjects describe areas of interest, with published work linked where available.
        </p>
      </header>

      <div className="areas-guide">
        {researchAreas.map((area, index) => {
          const count = publications.filter((publication) => publication.area === area.slug).length;
          return (
            <details
              className="areas-field"
              key={area.slug}
              open={index === 0}
              id={`field-${area.slug}`}
            >
              <summary>
                <div>
                  <h2>{area.name}</h2>
                  <p>{area.scope}</p>
                </div>
                <span className="areas-disclosure" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <path d="M3 10h14" />
                    <path className="areas-disclosure-vertical" d="M10 3v14" />
                  </svg>
                </span>
              </summary>
              <div className="areas-field-body">
                <div className="areas-questions">
                  <h3>Questions to explore</h3>
                  <ul>
                    {area.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </div>
                <div className="areas-evidence">
                  <h3>Evidence to examine</h3>
                  <ul>
                    {area.evidence.map((evidence) => (
                      <li key={evidence}>{evidence}</li>
                    ))}
                  </ul>
                </div>
                <div className="areas-publications" data-volatile="">
                  <p>
                    {count > 0
                      ? `${count} published ${count === 1 ? "report" : "reports"} in this area.`
                      : "No published research in this area yet."}
                  </p>
                  <Link
                    className="areas-link"
                    href={count > 0 ? `/research?area=${area.slug}` : "/research"}
                  >
                    {count > 0 ? `Read ${area.name} research` : "Look at the research"}{" "}
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <footer className="areas-footer">
        <p>Follow a question through its sources and limitations.</p>
        <Link className="areas-link" href="/methodology">
          Check out our methodology <ArrowIcon />
        </Link>
      </footer>
    </div>
  );
}
