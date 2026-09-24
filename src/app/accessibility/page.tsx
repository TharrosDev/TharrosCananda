import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { MethodRail } from "@/components/method-rail";
import { PageHero } from "@/components/page-hero";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Tharros Canada's accessibility target (WCAG 2.2 AA), current interface practices and how to report a problem.",
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
          { label: "Updated", value: "September 23, 2026" },
          { label: "Standard", value: "WCAG 2.2 AA" },
          { label: "Contact", value: <a href={`mailto:${contactEmail}`}>{contactEmail}</a> },
        ]}
      />
      <div className="document-body">
        <MethodRail items={sections} label="Sections" />
        <div className="document-sheet">
          <article id="target">
            <h2>Target</h2>
            <p>
              Tharros Canada aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at
              level AA across the site.
            </p>
          </article>
          <article id="checked">
            <h2>How it is checked</h2>
            <p>Every change to the site runs automated checks before it is published:</p>
            <ul>
              <li>
                An axe accessibility audit of every page, which blocks serious and critical issues.
              </li>
              <li>No horizontal scrolling at widths from 320 to 1440 pixels.</li>
              <li>Touch targets of at least 44 pixels on phones.</li>
              <li>Consistent, visible keyboard focus on links, buttons and form fields.</li>
              <li>Keyboard use of the menu, the report viewer and the request form.</li>
            </ul>
            <p>
              The site also includes a skip link, labelled form fields with clear errors, reduced
              motion when your system asks for it, and headings that stay visible below the sticky
              header when you follow a link.
            </p>
          </article>
          <article id="documents">
            <h2>Research documents</h2>
            <p>
              Every report page gives its summary, sources and limitations as ordinary web text. The
              full report opens in a viewer with selectable, searchable text, and can be downloaded
              as a PDF.
            </p>
          </article>
          <article id="limitations">
            <h2>Known limitations</h2>
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
          </article>
          <article id="report">
            <h2>Report a problem</h2>
            <p>
              Send the page, your device or assistive technology, and a short description to{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Requests for an accessible
              version of a report are welcome in the same way.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
