import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { MethodRail } from "@/components/method-rail";
import { PageHero } from "@/components/page-hero";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Tharros Undergraduate Publishing's accessibility target (WCAG 2.2 AA), current interface practices and how to report a problem.",
  path: "/accessibility",
});

const sections = [
  { id: "target", label: "Target" },
  { id: "checked", label: "How it is checked" },
  { id: "documents", label: "Research documents" },
  { id: "limitations", label: "Known limitations" },
  { id: "report", label: "Report a problem" },
];

export default function AccessibilityPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero
        variant="document"
        title="Accessibility."
        description="The standard the site aims for, how it is checked, and what is still imperfect."
        record={[
          { label: "Updated", value: "September 29, 2026" },
          { label: "Standard", value: "WCAG 2.2 AA" },
          { label: "Contact", value: <a href={`mailto:${contactEmail}`}>{contactEmail}</a> },
        ]}
      />
      <div className="document-body policy-body">
        <MethodRail items={sections} label="Sections" />
        <div className="document-sheet">
          <article id="target">
            <h2>Target</h2>
            <div className="policy-section-body">
              <p>
                Tharros aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA
                across the site.
              </p>
            </div>
          </article>
          <article id="checked">
            <h2>How it is checked</h2>
            <div className="policy-section-body">
              <p>Every change to the site runs automated checks before it is published:</p>
              <ul>
                <li>
                  An axe accessibility audit of the core pages and a representative report, which
                  blocks serious and critical issues.
                </li>
                <li>No horizontal scrolling at widths from 320 to 1440 pixels.</li>
                <li>Touch targets of at least 44 pixels on phones.</li>
                <li>Consistent, visible keyboard focus on links, buttons and form fields.</li>
                <li>Keyboard use of the menu, Research and the report viewer.</li>
              </ul>
              <p>
                The site also includes a skip link, labelled form fields with clear errors, reduced
                motion when your system asks for it, and headings that stay visible below the sticky
                header when you follow a link.
              </p>
            </div>
          </article>
          <article id="documents">
            <h2>Research documents</h2>
            <div className="policy-section-body">
              <p>
                Every report page gives its summary, sources and limitations as ordinary web text.
                The full report opens in a viewer with selectable, searchable text, and can be
                downloaded as a PDF.
              </p>
            </div>
          </article>
          <article id="limitations">
            <h2>Known limitations</h2>
            <div className="policy-section-body">
              <ul>
                <li>
                  Reports supplied by their authors are published exactly as written, so their PDF
                  tagging and image descriptions vary. An accessible version can be provided on
                  request.
                </li>
                <li>
                  Automated checks run in Chromium at desktop and phone sizes. Other browsers and
                  screen readers are not tested automatically, so reports of problems there are
                  especially useful.
                </li>
              </ul>
            </div>
          </article>
          <article id="report">
            <h2>Report a problem</h2>
            <div className="policy-section-body">
              <p>
                Send the page, your device or assistive technology, and a short description to{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Requests for an accessible
                version of a report are welcome in the same way.
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
