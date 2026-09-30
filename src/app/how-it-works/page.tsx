import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/site";
import "@/components/publishing-pages.css";

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "Prepare, review, publish and showcase undergraduate work with Tharros Canada. Explore the searchable research database and author profiles.",
  path: "/how-it-works",
});

const stages = [
  {
    title: "Prepare",
    description:
      "Choose a complete piece of original undergraduate work. Give it a clear title and summary, check your sources and credit every contributor. Submit through the intake process when it opens.",
  },
  {
    title: "Review",
    description:
      "Work will be screened for academic quality, sourcing, originality, writing and suitability. Decisions will be accepted, accepted with revisions or rejected; requested revisions come before publication.",
  },
  {
    title: "Publish",
    description:
      "Accepted work will receive a publication page in the searchable public database, with clear authorship, the work itself, a publication date, a shareable URL and a recommended citation.",
  },
  {
    title: "Showcase",
    description:
      "Link your work from résumés, applications and professional portfolios. Author profiles connect published works on a simple reference page. For new student contributors, profiles will be optional and require your consent when submissions open.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="publishing-page">
      <header className="publishing-masthead">
        <h1>How it works.</h1>
        <p>
          From a classroom project to work you can share. Tharros connects undergraduate research,
          its authors and its readers in a searchable public database.
        </p>
      </header>

      <ol className="publishing-flow" aria-label="Publication journey">
        {["Prepare", "Review", "Publish", "Showcase"].map((step, index) => (
          <li key={step}>
            <span>{step}</span>
            {index < 3 && <ArrowIcon />}
          </li>
        ))}
      </ol>

      <section className="publishing-launch" aria-labelledby="process-status-title">
        <h2 id="process-status-title">New submissions forthcoming</h2>
        <p>
          The research database and existing author profiles are available to explore. New student
          submissions are being prepared; the stages below describe the planned contribution
          process. Submission requirements and publication terms will be available before intake
          opens.
        </p>
        <Link className="text-link" href="/submit">
          Prepare your submission <ArrowIcon />
        </Link>
      </section>

      <section className="publishing-process" aria-labelledby="stages-title">
        <h2 id="stages-title">From coursework to a public showcase</h2>
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

      <section className="publishing-row" aria-labelledby="database-title">
        <h2 id="database-title">Explore the database</h2>
        <div className="publishing-row-body">
          <p>
            Search and filter the research database to find published work. Open a publication to
            read its paper and sources, get a citation, download the PDF or copy a link to share it.
            Each publication keeps the work and its authorship together.
          </p>
          <p>
            Author profiles bring each author’s published works together. Visit the{" "}
            <Link href="/authors">author directory</Link> to find authors and explore their work.
          </p>
          <Link className="text-link" href="/research">
            Browse the research database <ArrowIcon />
          </Link>
        </div>
      </section>

      <div className="publishing-close">
        <p>Start with the work you are proudest of.</p>
        <Link className="button-primary" href="/submit">
          Prepare your work <ArrowIcon />
        </Link>
        <Link className="text-link" href="/about#contact">
          Ask a question
        </Link>
      </div>
    </div>
  );
}
