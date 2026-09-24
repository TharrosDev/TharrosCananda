import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import "./request.css";
import { ResearchRequestForm } from "@/components/research-request-form";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Request Research",
  description:
    "Describe your research question and watch the brief take shape. Tharros Canada replies with a proposed scope, price and timeline in writing. No account or call required.",
  path: "/request-research",
});

const sequence = ["Describe the decision", "Receive a written scope", "Approve before work begins"];

export default function RequestResearchPage() {
  return (
    <>
      <header className="request-hero">
        <div className="request-hero-inner">
          <h1>Describe your research question.</h1>
          <p>
            Tharros replies with a proposed scope, price and timeline in writing. No account or call
            required.
          </p>
        </div>
        <ol className="request-sequence" aria-label="How a request proceeds">
          {sequence.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </header>
      <section className="request-section" aria-label="Research request">
        <ResearchRequestForm contactEmail={researchEmail()} />
      </section>
    </>
  );
}
