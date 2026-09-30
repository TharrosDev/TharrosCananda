import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { MethodRail } from "@/components/method-rail";
import { PageHero } from "@/components/page-hero";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What Tharros collects through readership counts and cookie-free site measurement, how earlier research requests are retained, and how to ask for access or deletion.",
  path: "/privacy",
});

const sections = [
  ["summary", "In short"],
  ["requests", "Earlier research requests"],
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
        record={[
          { label: "Updated", value: "September 30, 2026" },
          ...(organization.intakeRetention
            ? [{ label: "Requests kept", value: organization.intakeRetention }]
            : []),
          { label: "Contact", value: <a href={`mailto:${contactEmail}`}>{contactEmail}</a> },
        ]}
      />
      <div className="document-body policy-body">
        <MethodRail items={sections.map(([id, label]) => ({ id, label }))} label="Sections" />
        <div className="document-sheet">
          <article id="summary">
            <h2>In short</h2>
            <div className="policy-section-body">
              <ul className="is-grid">
                <li>No cookies, no advertising trackers and no account.</li>
                <li>Earlier research requests remain subject to the stated retention period.</li>
                <li>Readership counts keep a one-way code, never your IP address.</li>
                <li>A Global Privacy Control signal turns off measurement and counting.</li>
                <li>
                  Undergraduate submissions are not open; this site has no manuscript upload or
                  payment form.
                </li>
              </ul>
            </div>
          </article>
          <article id="requests">
            <h2>Earlier research requests</h2>
            <div className="policy-section-body">
              <p>
                The research request form has been retired. Requests submitted before its retirement
                included an organization, country, optional website, business email, research
                subject and purpose, and any context the sender chose to add. They were used to
                review and reply to the request; there was no mailing list.
              </p>
              <p>
                Those requests were sent over an encrypted connection to the Tharros intake
                database, hosted by Supabase in Canada (Montréal). Notifications were emailed to the
                Tharros inbox through Resend. Website logs recorded a reference number and delivery
                outcome, not the request text.
              </p>
              {organization.intakeRetention && (
                <p>
                  Earlier requests are kept for {organization.intakeRetention}, then deleted
                  automatically.
                </p>
              )}
            </div>
          </article>
          <article id="measurement">
            <h2>Site measurement</h2>
            <div className="policy-section-body">
              <p>
                The site uses Vercel Web Analytics to count page views. It sets no cookies and does
                not identify you. Nothing is sent when your browser sends a Global Privacy Control
                signal.
              </p>
            </div>
          </article>
          <article id="readership">
            <h2>Readership counts</h2>
            <div className="policy-section-body">
              <p>
                Published research shows how many times it has been viewed and cited. A view is
                counted after about 20 seconds of reading or a PDF download; a citation when a
                citation is copied. To count each reader once, the server combines your IP address
                with a secret and keeps only the resulting code, never the address. The code is
                different for every publication and is deleted after 30 days for views and 12 months
                for citations. Your browser also remembers what it has counted, in local storage.
                Nothing is counted when your browser sends a Global Privacy Control signal.
              </p>
            </div>
          </article>
          <article id="rights">
            <h2>Access and deletion</h2>
            <div className="policy-section-body">
              <p>
                You can ask what Tharros holds about you, have it corrected, or have it deleted.
                Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. For an earlier
                research request, write from the address you used or include its reference number.
              </p>
              <p>
                If this page changes in a way that affects information already submitted, the date
                above changes and the new terms apply only to information sent afterwards.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
