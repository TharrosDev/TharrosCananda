import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import "./request.css";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ResearchRequestForm } from "@/components/research-request-form";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Commission Canada–Europe Research",
  description:
    "Describe your research question. Tharros Canada replies with a proposed scope, price and timeline in writing. No account or call required.",
  path: "/request-research",
});

export default function RequestResearchPage() {
  const contactEmail = researchEmail();
  return (
    <>
      <header className="commission-hero">
        <div>
          <p>Commission research</p>
          <h1>Describe your research question.</h1>
        </div>
        <div>
          <p>Tharros will reply with a proposed scope, price and timeline.</p>
          <strong>No account or call required.</strong>
        </div>
      </header>
      <section className="commission-sequence" aria-label="Commissioning process">
        <div>
          <span>01</span>
          <strong>Describe the decision</strong>
        </div>
        <div>
          <span>02</span>
          <strong>Receive a written scope</strong>
        </div>
        <div>
          <span>03</span>
          <strong>Approve before work begins</strong>
        </div>
      </section>
      <section className="section section--compact request-layout commission-desk">
        <ResearchRequestForm contactEmail={contactEmail} />
        <aside className="request-sidebar">
          <p className="request-sidebar-label">Before you submit</p>
          <h2>Include</h2>
          <p>The question, geography, timing and intended use.</p>
          <h2>What not to send</h2>
          <p>
            Do not include trade secrets, unrelated personal information, passwords or confidential
            customer lists.
          </p>
          <h2>Scope</h2>
          <p>Tharros does not provide legal, tax, regulatory, lobbying or investment advice.</p>
          <h2>Prefer email?</h2>
          <p>
            Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the same
            information.
          </p>
          <nav className="request-trust-links" aria-label="Before commissioning">
            <Link href="/how-it-works">
              How commissions work <ArrowIcon />
            </Link>
            <Link href="/methodology">
              Sources & methodology <ArrowIcon />
            </Link>
          </nav>
        </aside>
      </section>
      <section className="commission-assurance">
        <p>Submitting does not create a purchase.</p>
        <p>Work starts after written approval.</p>
      </section>
    </>
  );
}
