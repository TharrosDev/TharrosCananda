import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description: "Tharros Canada provides independent Canadian market research for European companies evaluating Canada.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero title="Canadian commercial information should be easier to investigate." description="Tharros Canada provides independent Canadian market intelligence and commercial research for European companies evaluating Canada as a market." />
      <section className="section about-story">
        <div>
          <h2>What Tharros does</h2>
          <p>European SMEs considering Canada usually need answers to a few practical questions: is there demand, how is the market structured, who buys or distributes products like theirs, who already competes, and which route to market is realistic. Tharros researches those questions before the company commits budget, staff or partners.</p>
          <p>Useful Canadian evidence is spread across federal trade tables, importer records, tariff resources, provincial sources, sector associations and company websites. Each is public; few are connected. Tharros assembles them, checks them by hand and reports what they do and do not establish.</p>
          <h2>How research is done</h2>
          <p>Each engagement starts from a written scope that you approve. Official public data is used with its publisher, period and limitations recorded. Company and competitor findings are verified manually against their own public sources. Deliverables separate observation from inference, and state what remains uncertain.</p>
        </div>
        <aside>
          <span>Independence</span>
          <strong>Independent of government.</strong>
          <p>Tharros Canada is not affiliated with, endorsed by or acting for any government body or the publishers of the data it cites. It provides commercial intelligence, not legal, tax, customs, immigration, financial or compliance advice.</p>
        </aside>
      </section>
      <section className="section principles-list">
        <div><span>Sources stay visible</span><p>Every figure carries its publisher, period and limitations.</p></div>
        <div><span>Written, not pushed</span><p>Scope, price and timeline are agreed in writing. A call is optional.</p></div>
        <div><span>Bounded claims</span><p>Findings are stated as far as the evidence supports, and no further.</p></div>
        <div><span>Clear boundaries</span><p>Regulatory, tax and customs questions are flagged for qualified professionals.</p></div>
      </section>
      <section className="section policy-notes">
        <article id="privacy">
          <h2>Privacy</h2>
          <p>The research request form collects your company name, country, optional website, business email, a description of your product, your objectives in Canada, the type of research you are interested in and any context you add. It is used only to review and respond to your request.</p>
          <p>Submissions are sent securely to the Tharros Canada intake system for review. Consent to review the request is required; there is no marketing consent and nothing is preselected. No account is created and no advertising trackers are used.</p>
          <p>If usage measurement is enabled, the site records a small set of events (viewing the services page, opening a sample scenario, starting or submitting a request, and the research type chosen) together with the page path. The site sets no cookies for this, and nothing is recorded when your browser sends a Global Privacy Control signal.</p>
          {contactEmail ? (
            <p>To ask about or delete information you have submitted, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          ) : (
            <p>To ask about or delete information you have submitted, reply to any email you receive from Tharros Canada.</p>
          )}
        </article>
        <article id="accessibility">
          <h2>Accessibility</h2>
          <p>This site aims to meet WCAG 2.2 AA: semantic structure, keyboard operation, visible focus, text equivalents for charts, sufficient contrast, reduced-motion support and layouts that hold up under zoom and text scaling. Accessibility problems are treated as defects.</p>
        </article>
        {contactEmail && (
          <article id="contact">
            <h2>Contact</h2>
            <p>Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, or <Link href="/request-research">send a research request</Link>.</p>
          </article>
        )}
      </section>
      <section className="closing-cta"><div><h2>See how a Canadian market question is assembled.</h2><p>The Market Explorer shows the structure of a Tharros analysis using clearly labelled sample data.</p></div><Link className="button-primary" href="/market-explorer">Open the Market Explorer <ArrowIcon /></Link></section>
    </>
  );
}
