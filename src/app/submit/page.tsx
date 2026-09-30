import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { eligibleWork } from "@/data/publishing";
import { pageMetadata } from "@/lib/site";
import "@/components/publishing-pages.css";

export const metadata: Metadata = pageMetadata({
  title: "Showcase your work",
  description:
    "Prepare papers, research projects, policy briefs and data work for the Tharros Canada undergraduate research showcase. Submissions are forthcoming.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="publishing-page">
      <header className="publishing-masthead">
        <h1>Showcase your work.</h1>
        <p>
          Give your strongest undergraduate work a professional home beyond the classroom, with a
          publication you can share, reference and include in your portfolio.
        </p>
      </header>

      <section className="publishing-launch" aria-labelledby="launch-title">
        <h2 id="launch-title">Submissions forthcoming</h2>
        <p>
          New submissions are not open yet. Use this guidance to prepare your work while we develop
          the submission process, profiles for new student contributors and publication terms. Full
          requirements will be available before intake opens.
        </p>
        <Link className="text-link" href="/about#contact">
          Ask about showcasing your work <ArrowIcon />
        </Link>
      </section>

      <section className="publishing-row" id="eligible-work" aria-labelledby="eligible-title">
        <h2 id="eligible-title">Work worth sharing</h2>
        <div className="publishing-row-body">
          <p>
            Original undergraduate academic work with a clear purpose, sound evidence and careful
            sourcing. We are starting with Canadian university students across disciplines,
            including the humanities, social sciences, business, environmental studies and sciences.
          </p>
          <ul className="publishing-work-list">
            {eligibleWork.map((work) => (
              <li key={work}>{work}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="publishing-row" aria-labelledby="prepare-title">
        <h2 id="prepare-title">Prepare your work</h2>
        <div className="publishing-row-body">
          <ul className="publishing-checklist">
            <li>A complete paper or project with a clear title, a short summary and references.</li>
            <li>Accurate citations and a clear account of your evidence and methods.</li>
            <li>Clear authorship, with every contributor listed and credited.</li>
            <li>Permission to publish any shared work or third-party material included.</li>
          </ul>
          <p>
            Detailed file requirements and publication terms will be available before submissions
            open. Check them before sending your work.
          </p>
        </div>
      </section>

      <section className="publishing-row" aria-labelledby="review-title">
        <h2 id="review-title">How work is assessed</h2>
        <div className="publishing-row-body">
          <p>
            Editorial screening will consider academic quality, citations and sourcing, originality,
            writing quality, suitability for publication and formatting. Decisions will be accepted,
            accepted with revisions or rejected.
          </p>
          <p>
            Plagiarism, fabricated research, unsupported claims and incomplete work do not meet the
            standard. Submission does not guarantee publication.
          </p>
          <Link className="text-link" href="/how-it-works">
            See how the showcase works <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className="publishing-row" aria-labelledby="showcase-title">
        <h2 id="showcase-title">A home for your work</h2>
        <div className="publishing-row-body">
          <p>
            Accepted work will join a searchable public database with a publication page, clear
            authorship, a shareable link and a recommended citation. Readers will be able to find
            your work and engage with the research itself.
          </p>
          <p>
            When new submissions open, optional author profiles will bring your published work
            together in one place to reference from résumés, applications, LinkedIn and professional
            portfolios. Your consent will determine what personal information is displayed.
          </p>
        </div>
      </section>

      <div className="publishing-close">
        <p>Questions while you prepare?</p>
        <Link className="button-primary" href="/about#contact">
          Contact Tharros <ArrowIcon />
        </Link>
        <Link className="text-link" href="/privacy">
          Read the privacy policy
        </Link>
      </div>
    </div>
  );
}
