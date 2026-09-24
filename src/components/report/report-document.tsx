import type { Publication, ReportBlock } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { formatMonthYear } from "@/lib/site";

export function ReportBlocks({ blocks }: { blocks: ReportBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "heading":
        return (
          <h2 key={index}>
            {block.number !== undefined && <span>{block.number}</span>}
            {block.text}
          </h2>
        );
      case "lede":
        return <p key={index} className="report-lede">{block.text}</p>;
      case "paragraph":
        return <p key={index}>{block.text}</p>;
      case "callout":
        return <blockquote key={index} className="report-callout">{block.text}</blockquote>;
      case "findings":
        return (
          <ol key={index} className="report-findings">
            {block.items.map((item) => <li key={item.lead}><strong>{item.lead}</strong> {item.text}</li>)}
          </ol>
        );
      case "list":
        return <ul key={index} className="report-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
      case "sources":
        return (
          <ol key={index} className="report-sources">
            {block.items.map((s, i) => (
              <li key={i}>
                {s.publisher}. <em>{s.title}.</em>
                {s.period ? ` ${s.period}.` : ""}
              </li>
            ))}
          </ol>
        );
      case "figure":
        return (
          <figure key={index} className="report-figure">
            <svg viewBox="0 0 320 180" role="img" aria-label="Placeholder figure with no data">
              {[30, 70, 110, 150].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} className="report-figure-grid" />)}
              <path d="M0 140 C60 128 90 96 140 102 S230 58 320 44" className="report-figure-line" />
              <path d="M0 150 C70 146 120 132 170 128 S260 110 320 104" className="report-figure-line report-figure-line-muted" />
            </svg>
            <figcaption><strong>Figure 1.</strong> {block.caption} Source: {block.source}</figcaption>
          </figure>
        );
      case "columns":
        return (
          <div key={index} className="report-columns">
            <div><ReportBlocks blocks={block.left} /></div>
            <div><ReportBlocks blocks={block.right} /></div>
          </div>
        );
    }
  });
}

export function ReportDocument({ publication, citation }: { publication: Publication; citation: string }) {
  const area = researchAreas.find((a) => a.slug === publication.area)?.name ?? publication.area;
  const originLabel = publication.origin === "independent" ? "Independent research by Tharros Canada" : "Client-commissioned research";
  return (
    <article className="report-document report-document--print">
      <div className="report-page-body">
        <p className="report-kicker">{publication.type} · {area}</p>
        <h1>{publication.title}</h1>
        {publication.subtitle && <p className="report-subtitle">{publication.subtitle}</p>}
        <dl className="report-meta">
          <div><dt>Reference</dt><dd>{publication.reference}</dd></div>
          <div><dt>Published</dt><dd>{formatMonthYear(publication.publishedAt)}</dd></div>
          <div><dt>Authors</dt><dd>{publication.authors.join(", ")}</dd></div>
          <div><dt>Origin</dt><dd>{originLabel}</dd></div>
        </dl>
        <ReportBlocks blocks={publication.body} />
        <div className="report-citation">
          <h2>Suggested citation</h2>
          <p>{citation}</p>
        </div>
      </div>
    </article>
  );
}
