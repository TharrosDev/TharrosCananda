import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ResearchRequestForm } from "@/components/research-request-form";
import { researchEmail } from "@/lib/contact";
import { prefillFromSearchParams } from "@/lib/research-request";

export const metadata: Metadata = {
  title: "Request Research",
  description: "Request scoped Canadian market, buyer, distributor or competitor research in writing. No account or call required.",
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
      <PageHero title="Describe the Canadian decision you need to make." description="No account and no mandatory call. After submission, Tharros reviews the request and replies in writing with any clarification, a proposed deliverable, a price and an estimated timeline." aside={<div className="hero-aside"><span>Before research begins</span><strong>You approve the scope.</strong><p>Submitting this form is a request for review, not a purchase or engagement.</p></div>} />
      <section className="section request-layout">
        <ResearchRequestForm key={JSON.stringify(initial)} initial={initial} contactEmail={contactEmail} />
        <aside className="request-sidebar">
          <h2>Useful to have</h2><p>A plain-language product description is enough to begin. Add an HS code only if you already know it.</p>
          <h2>What not to send</h2><p>Do not include trade secrets, personal information unrelated to the request, passwords or confidential customer lists.</p>
          <h2>Commercial boundaries</h2><p>Tharros provides market intelligence and public-source commercial research, not legal, tax, customs, immigration, financial or compliance advice.</p>
          {contactEmail && <><h2>Prefer email?</h2><p>Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the same information.</p></>}
        </aside>
      </section>
    </>
  );
}
