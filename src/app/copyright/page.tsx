import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";
import { researchLicence } from "@/lib/licence";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Copyright & Licence",
  description: "Tharros Canada public research is licensed under Creative Commons Attribution 4.0 (CC BY 4.0). What you can reuse, how to credit it and what the licence does not cover.",
  alternates: { canonical: "/copyright" },
};

export default function CopyrightPage() {
  const contactEmail = researchEmail();
  const owner = organization.legal?.legalName ?? "Tharros Canada";

  return (
    <>
      <PageHero
        variant="document"
        title="Copyright and licence."
        description={`Tharros public research is open research: free to share and adapt under ${researchLicence.name} (${researchLicence.short}).`}
      />
      <section className="section policy-page">
        <article>
          <h2>What the licence covers</h2>
          <p>
            Publications in the <Link href="/research">Research archive</Link> are licensed under{" "}
            <a href={researchLicence.url} rel="license">{researchLicence.name}</a>, unless a publication states otherwise. This
            includes the text, charts and tables Tharros produces for them, in both the web page and the PDF.
          </p>
        </article>
        <article>
          <h2>What you can do</h2>
          <ul>
            <li><strong>Share:</strong> copy and redistribute the research in any medium or format.</li>
            <li><strong>Adapt:</strong> quote, translate, remix, transform and build on it.</li>
            <li><strong>For any purpose,</strong> including commercial use.</li>
          </ul>
        </article>
        <article>
          <h2>What you must do</h2>
          <ul>
            <li>Credit {owner} and the publication title.</li>
            <li>Link to the publication and to the licence.</li>
            <li>Say whether you made changes.</li>
            <li>Do not suggest that Tharros endorses you or your use.</li>
            <li>Do not add legal terms or technical measures that stop others doing what the licence allows.</li>
          </ul>
        </article>
        <article>
          <h2>How to credit</h2>
          <p>A credit line can be as simple as:</p>
          <p className="policy-example">“[Publication title]” by {owner}, {siteUrl.replace(/^https?:\/\//, "")}/research/[publication], licensed under {researchLicence.short}. Changes: [describe, or “none”].</p>
          <p>Every report also has a Cite panel with ready-made APA, MLA, Chicago and Harvard citations.</p>
        </article>
        <article>
          <h2>What is not covered</h2>
          <ul>
            <li><strong>Name and brand.</strong> The Tharros Canada name, logo and wordmark are not licensed for reuse.</li>
            <li><strong>Third-party sources.</strong> Data and documents from publishers such as Statistics Canada, Eurostat or Tenders Electronic Daily keep their own publishers&apos; terms. The licence covers Tharros&apos;s analysis, not the source material. Each report lists its sources.</li>
            <li><strong>Commissioned work.</strong> Research delivered to a client is not published under this licence unless the client and Tharros agree in writing to publish it.</li>
            <li><strong>This website.</strong> The site&apos;s code, design and other pages are not covered.</li>
          </ul>
        </article>
        <article>
          <h2>Copyright</h2>
          <p>© {owner}. All rights not granted by the licence are reserved.</p>
          <p>
            This page is a summary, not the licence itself. The{" "}
            <a href={`${researchLicence.url}legalcode`}>{researchLicence.short} legal code</a> sets out the binding terms,
            including its disclaimer of warranties.
          </p>
        </article>
        <article>
          <h2>Questions and permissions</h2>
          <p>For uses the licence does not cover, write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
        </article>
      </section>
    </>
  );
}
