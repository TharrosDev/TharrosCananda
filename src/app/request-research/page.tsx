import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ResearchRequestForm } from "@/components/research-request-form";
import { researchEmail } from "@/lib/contact";
import { prefillFromSearchParams } from "@/lib/research-request";

export const metadata: Metadata = {
  title: "Commission Research",
  description: "Commission focused Canada–Europe research in writing. Describe the question and decision; Tharros returns a proposed scope, price and timeline.",
  alternates: { canonical: "/request-research" },
};

export default async function RequestResearchPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const initial=prefillFromSearchParams(await searchParams);
  const contactEmail=researchEmail();
  return <>
    <header className="commission-hero"><div><p>Commission research</p><h1>Turn the question into a research brief.</h1></div><div><p>Describe the decision, subject and geography. Tharros reviews the request and replies in writing with a proposed scope, price and timeline.</p><strong>No account. No mandatory call. No purchase on submission.</strong></div></header>
    <section className="commission-sequence" aria-label="Commissioning process"><div><span>01</span><strong>Describe the decision</strong></div><div><span>02</span><strong>Receive a written scope</strong></div><div><span>03</span><strong>Approve before work begins</strong></div></section>
    <section className="section section--compact request-layout commission-desk"><ResearchRequestForm key={JSON.stringify(initial)} initial={initial} contactEmail={contactEmail}/><aside className="request-sidebar">
      <p className="request-sidebar-label">A useful request includes</p>
      <h2>Useful to have</h2><p>A plain-language description of the question, geography, timing and the decision it supports.</p>
      <h2>What not to send</h2><p>Do not include trade secrets, unrelated personal information, passwords or confidential customer lists.</p>
      <h2>Commercial boundaries</h2><p>Commercial research and intelligence only; not legal, tax, regulatory, lobbying or investment advice.</p>
      {contactEmail&&<><h2>Prefer email?</h2><p>Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the same information.</p></>}
      <nav className="request-trust-links" aria-label="Before commissioning"><Link href="/how-it-works">How commissions work <ArrowIcon/></Link><Link href="/methodology">Sources & methodology <ArrowIcon/></Link></nav>
    </aside></section>
    <section className="commission-assurance"><p>Submitting is a request for review—not a checkout.</p><p>Research starts only after you approve the written scope.</p></section>
  </>;
}
