import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description: "Tharros Canada is an independent commercial research and intelligence company focused on Canada–Europe relations.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero
        title="An independent commercial research company."
        description="Tharros Canada researches the commercial, economic, industrial, technological and strategic developments connecting Canada and Europe, and provides commissioned research to organizations working across that relationship."
      />
      <section className="section about-story">
        <div>
          <h2>How the work is done</h2>
          <p>Evidence on Canada–Europe questions is spread across trade tables, procurement notices, company filings, policy documents and sector sources on both sides of the Atlantic. Tharros assembles it, checks it by hand and reports what it does and does not establish.</p>
          <p>Commissioned work starts from a written scope you approve. Every material fact names its source and period; interpretation is labelled as interpretation.</p>
        </div>
        <aside>
          <strong>Independent of government.</strong>
          <p>Tharros Canada is a commercial company. It is not affiliated with or acting for any government, and it does not provide legal, tax, regulatory, lobbying or investment advice.</p>
        </aside>
      </section>
      <section className="section policy-notes">
        <article id="privacy">
          <h2>Privacy</h2>
          <p>The research request form collects your organization, country, optional website, business email, the subject and purpose of the research, and any context you add. It is used only to respond to your request and is sent securely to the Tharros Canada intake system. Consent to review is required; there is no marketing consent and nothing is preselected.</p>
          <p>If usage measurement is enabled, the site records a small set of events (viewing the services page, opening a sample scenario, starting or submitting a request, and the research type chosen) with the page path. No cookies are set for this, and nothing is recorded when your browser sends a Global Privacy Control signal.</p>
          {contactEmail ? (
            <p>To ask about or delete information you have submitted, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          ) : (
            <p>To ask about or delete information you have submitted, reply to any email you receive from Tharros Canada.</p>
          )}
        </article>
        <article id="accessibility">
          <h2>Accessibility</h2>
          <p>The site aims to meet WCAG 2.2 AA. Accessibility problems are treated as defects.</p>
          {contactEmail && <p>Contact: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>}
        </article>
      </section>
      <section className="closing-cta">
        <h2>Have a question that needs research?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
