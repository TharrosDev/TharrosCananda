import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";
import { commissionPrivacy } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What Tharros Canada collects through its request form, readership counts and cookie-free site measurement, where it is kept, for how long, and how to ask for access or deletion.",
  path: "/privacy",
});

const sections = [
  ["summary", "In short"],
  ["requests", "Research requests"],
  ["where", "Where it is kept"],
  ["commissions", "Commissioned work"],
  ["measurement", "Site measurement"],
  ["readership", "Readership counts"],
  ["rights", "Access and deletion"],
] as const;

export default function PrivacyPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero
        variant="document"
        title="Privacy."
        description="What the site collects, where it is kept, for how long, and how to ask for it back."
        index={sections.map(([id, label]) => ({ label, href: `#${id}` }))}
      />
      <section className="section policy-page">
        <p className="policy-updated">Last updated September 23, 2026.</p>
        <article id="summary">
          <h2>In short</h2>
          <ul>
            <li>No cookies, no advertising trackers and no account.</li>
            <li>
              A request you send is used only to reply to it, and is deleted after a set period.
            </li>
            <li>Readership counts keep a one-way code, never your IP address.</li>
            <li>A Global Privacy Control signal turns off measurement and counting.</li>
          </ul>
        </article>
        <article id="requests">
          <h2>Research requests</h2>
          <p>
            The request form collects your organization, country, optional website, business email,
            research subject and purpose, and any context you choose to add. It is used to review
            the request and reply with a scope. Consent to that review is required; there is no
            preselected marketing consent and no mailing list.
          </p>
          <p>
            Do not send passwords, unrelated personal information, confidential customer lists or
            trade secrets through the public form. Sensitive material can be shared later, once a
            scope is agreed.
          </p>
        </article>
        <article id="where">
          <h2>Where it is kept</h2>
          <p>
            The website does not store your request. It sends it once, over an encrypted connection,
            to the Tharros intake database, hosted by Supabase in Canada (Montréal). A notification
            with the request is then emailed to the Tharros inbox through Resend. The website&apos;s
            own logs record a reference number and whether delivery succeeded, never what you wrote.
          </p>
          {organization.intakeRetention && (
            <p>Requests are kept for {organization.intakeRetention}, then deleted automatically.</p>
          )}
        </article>
        <article id="commissions">
          <h2>Commissioned work</h2>
          <p>
            {commissionPrivacy} Material a client shares for a commission is used only for that
            commission.
          </p>
        </article>
        <article id="measurement">
          <h2>Site measurement</h2>
          <p>
            The site uses Vercel Web Analytics to count page views and a few events, such as
            starting the request form. It sets no cookies and does not identify you. Nothing is sent
            when your browser sends a Global Privacy Control signal.
          </p>
        </article>
        <article id="readership">
          <h2>Readership counts</h2>
          <p>
            Published research shows how many times it has been viewed and cited. A view is counted
            after about 20 seconds of reading or a PDF download; a citation when a citation is
            copied. To count each reader once, the server combines your IP address with a secret and
            keeps only the resulting code, never the address. The code is different for every
            publication and is deleted after 30 days for views and 12 months for citations. Your
            browser also remembers what it has counted, in local storage. Nothing is counted when
            your browser sends a Global Privacy Control signal.
          </p>
        </article>
        <article id="rights">
          <h2>Access and deletion</h2>
          <p>
            You can ask what Tharros holds about you, have it corrected, or have it deleted. Write
            to <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from the address you used, or
            with the reference number shown after you submitted.
          </p>
          <p>
            If this page changes in a way that affects information already submitted, the date above
            changes and the new terms apply only to information sent afterwards.
          </p>
        </article>
      </section>
    </>
  );
}
