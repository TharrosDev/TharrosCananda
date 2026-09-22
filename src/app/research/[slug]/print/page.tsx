import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportDocument } from "@/components/report/report-document";
import { allPublications, publicationBySlug } from "@/data/publications";
import { buildCitation } from "@/lib/citation";
import { display, sans } from "@/lib/fonts";
import { reportSourceHash } from "@/lib/report-source";
import { siteUrl } from "@/lib/site";
import "@/components/report/report.css";

// Print surface: the only source scripts/report-pdf.mjs prints to PDF. Not linked, not indexed.
export const dynamicParams = false;
export const generateStaticParams = () => allPublications.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = publicationBySlug((await params).slug);
  if (!p) return {};
  // Literal path so the build traces one file, not the project. Must match REPORT_CSS_PATH.
  const css = readFileSync(join(process.cwd(), "src", "components", "report", "report.css"), "utf8");
  return {
    title: `${p.title} (print)`,
    robots: { index: false, follow: false },
    other: {
      "report-reference": p.reference,
      "report-title": p.title,
      "report-authors": JSON.stringify(p.authors),
      "report-abstract": p.summary,
      "report-keywords": (p.tags ?? []).join(", "),
      "report-published": p.publishedAt,
      "report-sha": reportSourceHash(p, css),
    },
  };
}

export default async function ReportPrintPage({ params }: Props) {
  const p = publicationBySlug((await params).slug);
  if (!p) notFound();
  const citation = buildCitation("apa", {
    title: p.title,
    authors: p.authors,
    publishedAt: p.publishedAt,
    url: `${siteUrl}/research/id/${p.reference}`,
    reference: p.reference,
  });
  const head = `${p.type} · ${p.specimen ? "Example layout" : p.reference}`;
  const foot = p.specimen ? "Placeholder text. Not a Tharros Canada publication." : `${p.reference} · ${siteUrl.replace(/^https?:\/\//, "")}`;
  // @page margin boxes repeat the running head and foot on every PDF page (Chromium 131+).
  // Custom properties do not resolve inside margin boxes, so token values are literal here.
  const runningText = `font-family: ${sans.style.fontFamily}; font-size: 8pt; font-weight: 600; letter-spacing: .1em; color: #5d6166;`;
  const pageCss = `
    @page { size: Letter; margin: 1in 0.75in 0.9in; background: #faf8f3;
      @top-left { content: "THARROS / CANADA"; font-family: ${display.style.fontFamily}; font-size: 9.5pt; letter-spacing: .16em; color: #1c1d1f; vertical-align: bottom; padding-bottom: 10pt; margin-bottom: 18pt; border-bottom: 0.75pt solid #1c1d1f; }
      @top-right { content: ${JSON.stringify(head.toUpperCase())}; ${runningText} vertical-align: bottom; padding-bottom: 10pt; margin-bottom: 18pt; border-bottom: 0.75pt solid #1c1d1f; }
      @bottom-left { content: ${JSON.stringify(foot.toUpperCase())}; ${runningText} vertical-align: top; padding-top: 10pt; margin-top: 14pt; border-top: 0.75pt solid rgba(28, 29, 31, 0.13); }
      @bottom-right { content: counter(page) " / " counter(pages); ${runningText} vertical-align: top; padding-top: 10pt; margin-top: 14pt; border-top: 0.75pt solid rgba(28, 29, 31, 0.13); }
    }`;
  return (
    <>
      <style>{pageCss}</style>
      <ReportDocument publication={p} citation={citation} />
    </>
  );
}
