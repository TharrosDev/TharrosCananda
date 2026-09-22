import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
          <h2>What not to submit</h2>
          <p>Do not submit passwords, unrelated personal information, confidential customer lists or trade secrets through the public form.</p>
        </article>
        <article>
          <h2>Site measurement</h2>
          <p>If usage measurement is enabled, the site may record a small set of events and the page path. Nothing is sent when no endpoint is configured or when the browser sends a Global Privacy Control signal.</p>
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
