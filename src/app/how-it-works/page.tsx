import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/site";
import "@/components/publishing-pages.css";

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "From submission and editorial review to refinement and publication: the planned Tharros Undergraduate Publishing process. Preparing for launch; submissions and pricing are forthcoming.",
  path: "/how-it-works",
});

const stages = [
  {
    title: "Submit",
    description:
      "Send your original undergraduate work and basic author information through the submission process when it opens.",
  },
  {
    title: "Screening",
    description:
      "Tharros checks academic quality, citations and sourcing, originality, writing quality, publication suitability and formatting.",
  },
  {
    title: "Decision",
    description:
      "Receive an editorial decision: accepted, accepted with revisions or rejected. If revisions are requested, refine the work before it can move forward.",
  },
  {
    title: "Payment",
    description:
      "Only accepted authors move to the publication fee. Pricing and any optional services will be announced before submissions open.",
  },
  {
    title: "Preparation",
    description:
      "Tharros formats and prepares the accepted work as a professional publication, with its sources and authorship clearly presented.",
  },
  {
    title: "Publish",
    description:
      "Share the public publication page and professional PDF, with a stable URL, publication date and recommended citation. An author profile is optional and requires your consent.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="publishing-page">
      <header className="publishing-masthead">
        <h1>How it works.</h1>
        <p>
          You have already done the work. Our planned process gives accepted undergraduate research
          a professional, publicly accessible home.
        </p>
      </header>

      <ol className="publishing-flow" aria-label="Publication journey">
        {["Submit", "Review", "Refine", "Publish"].map((step, index) => (
          <li key={step}>
            <span>{step}</span>
            {index < 3 && <ArrowIcon />}
          </li>
        ))}
      </ol>

      <section className="publishing-launch" aria-labelledby="process-status-title">
        <h2 id="process-status-title">Preparing for launch</h2>
        <p>
          Submissions and publication pricing are forthcoming. The stages below describe the planned
          service; intake is not open yet.
        </p>
        <Link className="text-link" href="/submit">
          Prepare your submission <ArrowIcon />
        </Link>
      </section>

      <section className="publishing-process" aria-labelledby="stages-title">
        <h2 id="stages-title">From paper to publication</h2>
        <ol className="publishing-stages">
          {stages.map((stage, index) => (
            <li key={stage.title}>
              <span className="publishing-stage-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="publishing-row" aria-labelledby="share-title">
        <h2 id="share-title">A piece you can share</h2>
        <div className="publishing-row-body">
          <p>
            A publication lets readers see your work directly. Link it from your résumé, LinkedIn
            profile or professional portfolio, and use it to show your thinking in applications. The
            value begins with the quality of the paper you wrote.
          </p>
        </div>
      </section>

      <div className="publishing-close">
        <p>Start with the work you are proudest of.</p>
        <Link className="button-primary" href="/submit">
          See submission guidance <ArrowIcon />
        </Link>
        <Link className="text-link" href="/about#contact">
          Ask a question
        </Link>
      </div>
    </div>
  );
}
