import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Tharros Canada's accessibility approach and contact path for reporting accessibility problems.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero
        variant="document"
        title="Accessibility."
        description="How the site supports keyboard navigation, assistive technology and reduced motion."
      />
      <section className="section policy-page">
        <article>
          <h2>Target</h2>
          <p>Tharros Canada aims to meet WCAG 2.2 AA.</p>
        </article>
        <article>
          <h2>Current interface practices</h2>
          <p>The site includes a skip link, visible keyboard focus, semantic form labels and errors, reduced-motion handling, text equivalents for chart data, minimum target sizing and sticky-header offsets for anchored content.</p>
        </article>
        <article>
          <h2>Data and document formats</h2>
          <p>Research remains available in HTML when a downloadable report is provided. Data interfaces include text or table equivalents for charts.</p>
        </article>
        <article>
          <h2>Report a problem</h2>
          <p>Send the page, device or assistive technology involved and a short description to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
        </article>
      </section>
    </>
  );
}
