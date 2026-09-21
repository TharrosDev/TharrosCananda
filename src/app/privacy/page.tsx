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
        description="A concise statement of what the site collects, why it is collected and what is not collected by default."
      />
      <section className="section policy-page">
        <article>
          <h2>Research requests</h2>
          <p>The research request form collects your organization, country, optional website, business email, research subject and purpose, and any context you choose to add. It is used to review and respond to the request.</p>
          <p>Consent to review the submitted information is required. There is no preselected marketing consent.</p>
        </article>
        <article>
          <h2>What not to submit</h2>
          <p>Do not submit passwords, unrelated personal information, confidential customer lists or trade secrets through the public intake form. A later engagement can define a more appropriate exchange method if sensitive material is genuinely required.</p>
        </article>
        <article>
          <h2>Site measurement</h2>
          <p>If usage measurement is enabled, the site can record a small set of product events with the page path. No analytics vendor is installed by default, and nothing is sent when the configured endpoint is absent or when the browser sends a Global Privacy Control signal.</p>
        </article>
        <article>
          <h2>Contact and deletion requests</h2>
          {contactEmail ? (
            <p>To ask about information you submitted or request deletion, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          ) : (
            <p>To ask about information you submitted or request deletion, reply to any email you receive from Tharros Canada. A public contact address will appear here only when one is configured and monitored.</p>
          )}
        </article>
        <article>
          <h2>Operational note</h2>
          <p>Storage, retention and access controls must match the actual intake system used in production. The public wording should be reviewed again whenever that operational setup changes.</p>
        </article>
      </section>
    </>
  );
}
