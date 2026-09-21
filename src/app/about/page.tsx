import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
  description: "About Tharros Canada, an independent Canadian market-intelligence venture.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="Canadian commercial information should be easier to investigate." description="Tharros Canada is an independent market-intelligence venture focused on helping European companies understand Canada before they commit to it." />
      <section className="section about-story">
        <div><h2>The premise</h2><p>Useful Canadian market evidence is spread across trade tables, importer records, tariff resources, corporate websites, provincial contexts and sector organizations. Finding it is possible. Turning it into a decision is harder.</p><p>Tharros is being built to connect those public signals with focused human research—without pretending that an automated metric can replace classification, verification or commercial judgment.</p></div>
        <aside><span>Current stage</span><strong>Early-stage, independent, and built for validation.</strong><p>No invented client list. No implied government relationship. No claim that the platform already contains data it does not.</p></aside>
      </section>
      <section className="section principles-list">
        <div><span>Method over theatre</span><p>Sources, dates and limitations stay visible.</p></div>
        <div><span>Useful before a meeting</span><p>Visitors can explore, compare and decide independently.</p></div>
        <div><span>Small enough to be honest</span><p>The site describes the venture at its actual stage.</p></div>
        <div><span>Built to learn</span><p>V1 measures real questions before adding costly infrastructure.</p></div>
      </section>
      <section className="section policy-notes">
        <article id="privacy"><h2>Privacy approach</h2><p>Tharros Canada is designed to collect only the information needed to respond to a research request. No advertising trackers, forced accounts or preselected marketing consent are included. A retention policy and final privacy notice must be completed when the production intake destination is configured.</p></article>
        <article id="accessibility"><h2>Accessibility commitment</h2><p>The interface targets WCAG 2.2 AA with semantic structure, keyboard operation, visible focus, accessible chart equivalents, strong contrast, reduced-motion support and responsive text scaling. Accessibility issues should be treated as product defects.</p></article>
      </section>
      <section className="closing-cta"><div><h2>See the product before reading the pitch.</h2><p>The Market Explorer is the clearest expression of what Tharros is building.</p></div><Link className="button-primary" href="/market-explorer">Open the Market Explorer <ArrowIcon /></Link></section>
    </>
  );
}
