import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ResearchRequestForm } from "@/components/research-request-form";
import { researchEmail } from "@/lib/contact";
import { prefillFromSearchParams } from "@/lib/research-request";

export const metadata: Metadata = {
  title: "Commission Research",
  description: "Commission focused Canada–Europe research in writing: market, buyer, competitor or custom research. No account or call required.",
  alternates: { canonical: "/request-research" },
};

export default async function RequestResearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initial = prefillFromSearchParams(await searchParams);
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero variant="task" title="Commission research." description="Describe the question. Tharros replies in writing with a proposed scope, price and timeline. Submitting is a request for review, not a purchase." />
      <section className="section request-layout">
        <ResearchRequestForm key={JSON.stringify(initial)} initial={initial} contactEmail={contactEmail} />
        <aside className="request-sidebar">
          <h2>Useful to have</h2><p>A plain-language description of the question and the decision it supports.</p>
          <h2>What not to send</h2><p>Do not include trade secrets, personal information unrelated to the request, passwords or confidential customer lists.</p>
          <h2>Commercial boundaries</h2><p>Commercial research and intelligence only; not legal, tax, regulatory, lobbying or investment advice.</p>
          {contactEmail && <><h2>Prefer email?</h2><p>Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the same information.</p></>}
          <nav className="request-trust-links" aria-label="Before commissioning">
            <Link href="/how-it-works">How commissions work <ArrowIcon /></Link>
            <Link href="/methodology">Sources & methodology <ArrowIcon /></Link>
          </nav>
        </aside>
      </section>
    </>
  );
}
