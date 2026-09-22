import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import "./report.css";

// A layout specimen, not a publication: placeholder text only, kept out of search and the sitemap.
export const metadata: Metadata = {
  title: "Example report layout",
  description: "How a Tharros Canada research report is laid out. Placeholder text only; not a publication.",
  robots: { index: false, follow: false },
};

const lorem = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum, nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.",
  "Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum, sed posuere consectetur est at lobortis.",
  "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
];

function PageFrame({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <section className="report-page" aria-label={`Page ${number} of 2`}>
      <header className="report-running-head"><span>THARROS / CANADA</span><span>Research Report · Example layout</span></header>
      <div className="report-page-body">{children}</div>
      <footer className="report-running-foot"><span>Placeholder text. Not a Tharros Canada publication.</span><span>{number} / 2</span></footer>
    </section>
  );
}

export default function ExampleReportPage() {
  return (
    <>
      <div className="report-notice" role="note">
        <div>
          <strong>Example layout</strong>
          <p>This shows how a Tharros research report is structured. Every word is lorem ipsum placeholder text, and the figure contains no data. It is not a publication and is not listed in the archive.</p>
        </div>
        <Link className="text-link" href="/research">Back to the research archive <ArrowIcon /></Link>
      </div>

      <article className="report-document">
        <PageFrame number={1}>
          <p className="report-kicker">Research Report · Trade & Economic Integration</p>
          <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>
          <p className="report-subtitle">Sed posuere consectetur est at lobortis: vestibulum id ligula porta felis euismod semper.</p>
          <dl className="report-meta">
            <div><dt>Reference</dt><dd>TC-EX-000</dd></div>
            <div><dt>Published</dt><dd>Month YYYY</dd></div>
            <div><dt>Authors</dt><dd>Author Name</dd></div>
            <div><dt>Origin</dt><dd>Independent research by Tharros Canada</dd></div>
          </dl>

          <h2>Executive summary</h2>
          <p className="report-lede">{lorem[0]}</p>

          <div className="report-columns">
            <div>
              <h2>Key findings</h2>
              <ol className="report-findings">
                <li><strong>Lorem ipsum dolor sit amet.</strong> Consectetur adipiscing elit, integer posuere erat a ante venenatis dapibus.</li>
                <li><strong>Maecenas faucibus mollis interdum.</strong> Nulla vitae elit libero, a pharetra augue donec ullamcorper.</li>
                <li><strong>Vestibulum id ligula porta.</strong> Felis euismod semper, cras mattis consectetur purus sit amet.</li>
              </ol>
            </div>
            <figure className="report-figure">
              <svg viewBox="0 0 320 180" role="img" aria-label="Placeholder figure with no data">
                {[30, 70, 110, 150].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} className="report-figure-grid" />)}
                <path d="M0 140 C60 128 90 96 140 102 S230 58 320 44" className="report-figure-line" />
                <path d="M0 150 C70 146 120 132 170 128 S260 110 320 104" className="report-figure-line report-figure-line-muted" />
              </svg>
              <figcaption><strong>Figure 1.</strong> Lorem ipsum dolor sit amet (illustrative placeholder, no data). Source: Publisher, dataset, period.</figcaption>
            </figure>
          </div>
        </PageFrame>

        <PageFrame number={2}>
          <h2><span>1</span>Lorem ipsum dolor sit amet</h2>
          <p>{lorem[1]}</p>
          <p>{lorem[2]}</p>
          <blockquote className="report-callout">Observation. Nullam quis risus eget urna mollis ornare vel eu leo, etiam porta sem malesuada magna.</blockquote>

          <h2><span>2</span>Methodology</h2>
          <p>{lorem[2]}</p>

          <div className="report-columns">
            <div>
              <h2><span>3</span>Limitations</h2>
              <ul className="report-list">
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Integer posuere erat a ante venenatis dapibus.</li>
                <li>Donec ullamcorper nulla non metus auctor fringilla.</li>
              </ul>
            </div>
            <div>
              <h2><span>4</span>Sources</h2>
              <ol className="report-sources">
                <li>Publisher. <em>Dataset or document title.</em> Reference period. Retrieved YYYY-MM-DD.</li>
                <li>Publisher. <em>Dataset or document title.</em> Reference period. Retrieved YYYY-MM-DD.</li>
                <li>Publisher. <em>Dataset or document title.</em> Reference period. Retrieved YYYY-MM-DD.</li>
              </ol>
            </div>
          </div>

          <div className="report-citation">
            <h2>Suggested citation</h2>
            <p>Author Name. <em>Lorem ipsum dolor sit amet.</em> Tharros Canada Research Report TC-EX-000, Month YYYY.</p>
          </div>
        </PageFrame>
      </article>

      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
