import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Tharros Canada handles information submitted through the research request form and optional site measurement.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero
        variant="document"
        title="Privacy."
        description="What the site collects and how submitted information is used."
      />
      <section className="section policy-page">
        <article>
          <h2>Research requests</h2>
          <p>The research request form collects your organization, country, optional website, business email, research subject and purpose, and any context you choose to add. It is used to review and respond to the request.</p>
          <p>Consent to review the submitted information is required. There is no preselected marketing consent.</p>
        </article>
        <article>
          <h2>Where a request goes</h2>
          <p>The website does not store your request. It sends it once, over an encrypted connection, to the Tharros Canada intake system, and tells you it was received only after that system confirms receipt. The website&apos;s own logs record a reference number and whether delivery succeeded, never what you wrote.</p>
          {organization.intakeRetention && <p>Requests are kept for {organization.intakeRetention}, then deleted.</p>}
        </article>
        <article>
          <h2>What not to submit</h2>
          <p>Do not submit passwords, unrelated personal information, confidential customer lists or trade secrets through the public form.</p>
        </article>
        <article>
          <h2>Site measurement</h2>
          <p>The site uses Vercel Web Analytics to count page views and a few events, such as starting the request form. It sets no cookies and does not identify you. Nothing is sent when your browser sends a Global Privacy Control signal.</p>
        </article>
        <article>
          <h2>Contact and deletion requests</h2>
          {contactEmail ? (
            <p>To ask about information you submitted or request deletion, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          ) : (
            <p>To ask about information you submitted or request deletion, reply to any email you receive from Tharros Canada. A public contact address will appear here only when one is configured and monitored.</p>
          )}
        </article>
      </section>
    </>
  );
}
