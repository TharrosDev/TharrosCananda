import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { eligibleWork } from "@/data/publishing";
import { pageMetadata } from "@/lib/site";
import "@/components/publishing-pages.css";

export const metadata: Metadata = pageMetadata({
  title: "Submit your work",
  description:
    "Prepare your undergraduate work for Tharros Undergraduate Publishing. Read eligibility, editorial standards and the planned publication process. Submissions and pricing are forthcoming.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="publishing-page">
      <header className="publishing-masthead">
        <h1>Submit your work.</h1>
        <p>
          Turn your strongest undergraduate work into a professional publication. Start by
          understanding what we will look for.
        </p>
      </header>

      <section className="publishing-launch" aria-labelledby="launch-title">
        <h2 id="launch-title">Submissions forthcoming</h2>
        <p>
          We are preparing for launch. Submissions are not open yet, and publication pricing will be
          announced before intake opens. This page explains the planned process so you can prepare
          your work.
        </p>
        <Link className="text-link" href="/about#contact">
          Ask a publishing question <ArrowIcon />
        </Link>
      </section>

      <section className="publishing-row" id="eligible-work" aria-labelledby="eligible-title">
        <h2 id="eligible-title">What you can submit</h2>
        <div className="publishing-row-body">
          <p>
            Original undergraduate work of reasonable academic quality. We are starting with
            Canadian university students and welcome work across disciplines, including the
            humanities, social sciences, business, environmental studies and sciences.
          </p>
          <ul className="publishing-work-list">
            {eligibleWork.map((work) => (
              <li key={work}>{work}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="publishing-row" aria-labelledby="prepare-title">
        <h2 id="prepare-title">Prepare your paper</h2>
        <div className="publishing-row-body">
          <ul className="publishing-checklist">
            <li>A complete paper with a clear title, a short abstract and a reference list.</li>
            <li>Accurate citations and a clear account of your evidence and methods.</li>
            <li>Your name, university and program or discipline, with every contributor listed.</li>
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
            Read the publication process <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className="publishing-row" aria-labelledby="pricing-title">
        <h2 id="pricing-title">Pricing forthcoming</h2>
        <div className="publishing-row-body">
          <p>
            Publication pricing and any optional services are being prepared. Payment will only be
            requested after an editorial acceptance decision. Paying a publication fee does not
            replace editorial review.
          </p>
          <p>
            The planned publication includes a professional PDF, a stable publication page and URL,
            a publication date and a recommended citation. Author profiles will be optional and
            published with the author’s consent.
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
