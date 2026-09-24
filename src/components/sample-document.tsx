"use client";

import { useRef, type ReactNode } from "react";
import type { ServiceSlug } from "@/lib/services";
import "./sample-document.css";

// Faux documents: placeholder text laid out like a delivered PDF, so a client can see the shape of the output.
// They follow the house report style (report.css) but are screen-only and never downloadable.
// ponytail: static lorem only; swap for real redacted samples once work exists.

const L1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const L2 =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.";
const L3 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.";

type Meta = { code: string; type: string; area: string; title: string; subtitle: string };

function Cover({ meta, total }: { meta: Meta; total: number }) {
  return (
    <article className="faux-page faux-cover">
      <div className="faux-cover-top">
        <span className="faux-mark">
          Tharros<span>/</span>Canada
        </span>
        <span className="faux-tag">Sample</span>
      </div>
      <div className="faux-cover-body">
        <p className="faux-kicker">
          {meta.type} · {meta.area}
        </p>
        <h3>{meta.title}</h3>
        <p className="faux-subtitle">{meta.subtitle}</p>
        <dl className="faux-meta">
          <div>
            <dt>Reference</dt>
            <dd>{meta.code}</dd>
          </div>
          <div>
            <dt>Prepared for</dt>
            <dd>Lorem Ipsum Client</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>00 Month 0000</dd>
          </div>
          <div>
            <dt>Distribution</dt>
            <dd>Client confidential</dd>
          </div>
        </dl>
      </div>
      <svg className="faux-route" viewBox="0 0 240 70" aria-hidden="true">
        <path d="M12 58 Q120 -8 228 44" />
        <circle cx="12" cy="58" r="3.5" />
        <circle cx="228" cy="44" r="3.5" />
      </svg>
      <Foot page={1} total={total} />
    </article>
  );
}

function Page({
  meta,
  page,
  total,
  children,
}: {
  meta: Meta;
  page: number;
  total: number;
  children: ReactNode;
}) {
  return (
    <article className="faux-page">
      <div className="faux-head">
        <span>
          {meta.code} · {meta.type}
        </span>
        <span className="faux-mark">
          Tharros<span>/</span>Canada
        </span>
      </div>
      {children}
      <Foot page={page} total={total} />
    </article>
  );
}

function Foot({ page, total }: { page: number; total: number }) {
  return (
    <div className="faux-foot">
      <span>Example layout · placeholder text</span>
      <span>
        {page} / {total}
      </span>
    </div>
  );
}

function H({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <h4>
      {n && <span>{n}</span>}
      {children}
    </h4>
  );
}

function Findings({ items }: { items: string[] }) {
  return (
    <ol className="faux-findings">
      {items.map((lead, i) => (
        <li key={i}>
          <strong>{lead}.</strong> {L3}
        </li>
      ))}
    </ol>
  );
}

function Table({ head, rows, num = [] }: { head: string[]; rows: ReactNode[][]; num?: number[] }) {
  return (
    <table>
      <thead>
        <tr>
          {head.map((cell, c) => (
            <th key={c} className={num.includes(c) ? "is-num" : undefined}>
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td key={c} className={num.includes(c) ? "is-num" : undefined}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Figure({ n, caption, children }: { n: number; caption: string; children: ReactNode }) {
  return (
    <figure className="faux-figure">
      {children}
      <figcaption>
        <strong>Figure {n}.</strong> {caption} Source: Lorem ipsum, 0000.
      </figcaption>
    </figure>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <span className="faux-meter" aria-hidden="true">
      <span style={{ width: `${value}%` }} />
    </span>
  );
}

function Dots({ filled }: { filled: number }) {
  return (
    <span className="faux-dots" role="img" aria-label={`${filled} of 4`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={i < filled ? "is-on" : undefined} />
      ))}
    </span>
  );
}

const sampleMeta: Record<ServiceSlug, Meta> = {
  "custom-research": {
    code: "TC-SAMPLE-CR",
    type: "Research Report",
    area: "Trade & Economic Integration",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    subtitle:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua across Canada and Europe.",
  },
  "market-assessment": {
    code: "TC-SAMPLE-MA",
    type: "Market Assessment",
    area: "Energy, Resources & Industry",
    title: "Lorem ipsum market: structure, size and incumbents",
    subtitle: "Duis aute irure dolor in reprehenderit, and where the openings may lie.",
  },
  "buyer-partner-research": {
    code: "TC-SAMPLE-BP",
    type: "Buyer & Partner Research",
    area: "Technology & Strategic Industries",
    title: "Lorem ipsum: candidate buyers and partners in Europe",
    subtitle: "Which organizations could realistically adipiscing elit, ranked by fit.",
  },
};

function CustomResearch() {
  const meta = sampleMeta["custom-research"];
  const total = 4;
  return (
    <>
      <Cover meta={meta} total={total} />
      <Page meta={meta} page={2} total={total}>
        <H>Contents</H>
        <ol className="faux-toc">
          {(
            [
              ["Executive summary", 2],
              ["Key findings", 3],
              ["Analysis", 4],
              ["Sources and limitations", 4],
            ] as const
          ).map(([item, page], i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item}
              <span>{page}</span>
            </li>
          ))}
        </ol>
        <H n="01">Executive summary</H>
        <p className="faux-lede">{L3}</p>
        <p>{L1}</p>
        <blockquote className="faux-callout">
          <span>Bottom line</span>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
        </blockquote>
      </Page>
      <Page meta={meta} page={3} total={total}>
        <H n="02">Key findings</H>
        <Findings
          items={[
            "Lorem ipsum dolor",
            "Consectetur adipiscing",
            "Sed do eiusmod",
            "Tempor incididunt",
          ]}
        />
        <p>{L2}</p>
        <H>What this means for the decision</H>
        <Table
          head={["Option", "Evidence", "Confidence"]}
          rows={[
            ["Lorem ipsum dolor", "Strong", <Dots key="d" filled={4} />],
            ["Sit amet consectetur", "Moderate", <Dots key="d" filled={3} />],
            ["Adipiscing elit", "Limited", <Dots key="d" filled={1} />],
          ]}
        />
      </Page>
      <Page meta={meta} page={4} total={total}>
        <H n="03">Analysis</H>
        <Figure n={1} caption="Lorem ipsum index, 0000–0000 (placeholder).">
          <svg viewBox="0 0 320 120" aria-hidden="true">
            {[20, 50, 80, 110].map((y) => (
              <line key={y} x1="0" x2="320" y1={y} y2={y} className="faux-grid" />
            ))}
            <path d="M0 96 C50 90 80 70 130 74 S220 38 320 26" className="faux-line" />
            <path d="M0 104 C60 102 110 92 160 90 S260 78 320 72" className="faux-line is-muted" />
          </svg>
        </Figure>
        <Table
          head={["Indicator", "Canada", "EU", "Δ"]}
          num={[1, 2, 3]}
          rows={[
            ["Lorem ipsum", "00.0", "00.0", "+0.0"],
            ["Dolor sit amet", "00.0", "00.0", "−0.0"],
            ["Consectetur", "00.0", "00.0", "+0.0"],
          ]}
        />
        <H n="04">Sources and limitations</H>
        <ol className="faux-sources">
          <li>
            Lorem Ipsum Agency. <em>Dolor sit amet dataset.</em> 0000. Retrieved 00 Month 0000.
          </li>
          <li>
            Consectetur Office. <em>Adipiscing elit register.</em> 0000.
          </li>
        </ol>
      </Page>
    </>
  );
}

function MarketAssessment() {
  const meta = sampleMeta["market-assessment"];
  const total = 4;
  return (
    <>
      <Cover meta={meta} total={total} />
      <Page meta={meta} page={2} total={total}>
        <H n="01">Market at a glance</H>
        <dl className="faux-kpis">
          {[
            ["0.0 bn", "Market size"],
            ["00%", "Annual growth"],
            ["00", "Incumbents"],
            ["0.00", "Concentration"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p>{L1}</p>
        <Figure n={1} caption="Lorem ipsum by segment, share of total (placeholder).">
          <div className="faux-hbars" aria-hidden="true">
            {[
              ["Lorem", 78],
              ["Ipsum", 61],
              ["Dolor", 44],
              ["Sit amet", 29],
              ["Other", 14],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <Meter value={Number(value)} />
                <span className="is-num">00%</span>
              </div>
            ))}
          </div>
        </Figure>
        <H>Demand drivers</H>
        <Findings items={["Lorem ipsum policy", "Dolor sit procurement"]} />
      </Page>
      <Page meta={meta} page={3} total={total}>
        <H n="02">Incumbents and competitors</H>
        <div className="faux-share" aria-hidden="true">
          {[34, 22, 16, 11, 17].map((value, i) => (
            <span key={i} style={{ flexGrow: value }} />
          ))}
        </div>
        <p className="faux-note">
          Share of lorem ipsum: Lorem Ipsum Ltd., Sit Amet GmbH, Adipiscing Inc., Tempor SA and
          others (placeholder).
        </p>
        <Table
          head={["Organization", "HQ", "Segment", "Share"]}
          num={[3]}
          rows={[
            ["Lorem Ipsum Ltd.", "CA", "Dolor", "00%"],
            ["Sit Amet GmbH", "DE", "Consectetur", "00%"],
            ["Adipiscing Inc.", "CA", "Dolor", "00%"],
            ["Tempor SA", "FR", "Elit", "00%"],
            ["Incididunt AB", "SE", "Magna", "00%"],
          ]}
        />
        <p>{L2}</p>
        <H>Routes to market</H>
        <div className="faux-columns">
          <p>
            <strong>Direct.</strong> {L3}
          </p>
          <p>
            <strong>Through partners.</strong> {L3}
          </p>
        </div>
      </Page>
      <Page meta={meta} page={4} total={total}>
        <H n="03">Segments to examine</H>
        <ul className="faux-rated">
          {[
            ["Lorem ipsum segment", 4],
            ["Dolor sit amet niche", 3],
            ["Consectetur channel", 2],
          ].map(([name, score]) => (
            <li key={name}>
              <div>
                <strong>{name}</strong>
                <p>{L3}</p>
              </div>
              <Dots filled={Number(score)} />
            </li>
          ))}
        </ul>
        <blockquote className="faux-callout">
          <span>Worth a closer look</span>
          Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
        </blockquote>
        <H n="04">Limitations</H>
        <p>{L2}</p>
      </Page>
    </>
  );
}

function BuyerPartner() {
  const meta = sampleMeta["buyer-partner-research"];
  const total = 4;
  return (
    <>
      <Cover meta={meta} total={total} />
      <Page meta={meta} page={2} total={total}>
        <H n="01">Approach</H>
        <p className="faux-lede">{L3}</p>
        <div className="faux-funnel" aria-hidden="true">
          {[
            ["000", "Organizations screened"],
            ["00", "Longlist"],
            ["00", "Ranked shortlist"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <H n="02">Fit criteria</H>
        <Table
          head={["Criterion", "Evidence used", "Weight"]}
          num={[2]}
          rows={[
            ["Lorem relevance", "Ipsum filings", "00%"],
            ["Dolor capacity", "Sit amet registry", "00%"],
            ["Procurement history", "Tender records", "00%"],
            ["Canada presence", "Company records", "00%"],
          ]}
        />
        <H>Sources screened</H>
        <ol className="faux-sources">
          <li>Lorem Ipsum business register, 00 countries. Retrieved 00 Month 0000.</li>
          <li>Dolor sit public tender archive, 0000–0000.</li>
          <li>Company filings, annual reports and trade association directories.</li>
        </ol>
      </Page>
      <Page meta={meta} page={3} total={total}>
        <H n="03">Ranked shortlist</H>
        <Table
          head={["#", "Organization", "Country", "Role", "Fit"]}
          rows={[
            ["01", "Lorem Ipsum AG", "DE", "Buyer", <Meter key="m" value={92} />],
            ["02", "Dolor Sit Ltd.", "IE", "Distributor", <Meter key="m" value={84} />],
            ["03", "Amet Systems BV", "NL", "Integrator", <Meter key="m" value={76} />],
            ["04", "Consectetur SA", "FR", "Partner", <Meter key="m" value={68} />],
            ["05", "Adipiscing Oy", "FI", "Buyer", <Meter key="m" value={57} />],
            ["06", "Elit Sp. z o.o.", "PL", "Distributor", <Meter key="m" value={49} />],
          ]}
        />
        <p className="faux-note">Fit is the weighted score across the four criteria on page 2.</p>
        <blockquote className="faux-callout">
          <span>Where to start</span>
          Lorem ipsum dolor sit amet: the first three candidates share a consectetur procurement
          cycle.
        </blockquote>
        <p>{L2}</p>
      </Page>
      <Page meta={meta} page={4} total={total}>
        <H n="04">Candidate profiles</H>
        {["01 · Lorem Ipsum AG", "02 · Dolor Sit Ltd."].map((name) => (
          <section className="faux-profile" key={name}>
            <h5>{name}</h5>
            <dl>
              <dt>Role</dt>
              <dd>Lorem ipsum buyer</dd>
              <dt>Why it fits</dt>
              <dd>{L3}</dd>
              <dt>Evidence</dt>
              <dd>Dolor sit registry, 0000; tender ref. 0000/000</dd>
              <dt>Suggested approach</dt>
              <dd>Consectetur adipiscing elit sed do eiusmod.</dd>
            </dl>
          </section>
        ))}
        <p className="faux-note">Profiles 03–06 follow the same structure.</p>
      </Page>
    </>
  );
}

const samples: Record<ServiceSlug, { file: string; Body: () => ReactNode }> = {
  "custom-research": { file: "TC-SAMPLE-CR.pdf", Body: CustomResearch },
  "market-assessment": { file: "TC-SAMPLE-MA.pdf", Body: MarketAssessment },
  "buyer-partner-research": { file: "TC-SAMPLE-BP.pdf", Body: BuyerPartner },
};

// The newest morph; an older one's cleanup must not clear names a newer one set (e.g. Escape during the open).
let latest: ViewTransition | undefined;

/**
 * Runs `update` as a view transition in which `from` grows or shrinks into `to` (the shelf cover and the
 * reader's first page share one name for the length of the transition). Without support, or under reduced
 * motion, `update` simply runs.
 */
function morph(
  name: string,
  from: HTMLElement | null,
  to: () => HTMLElement | null,
  update: () => void,
) {
  if (
    !from ||
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  from.style.viewTransitionName = name;
  const transition = document.startViewTransition(() => {
    from.style.viewTransitionName = "";
    update();
    const target = to();
    if (target) target.style.viewTransitionName = name;
  });
  latest = transition;
  transition.finished.finally(() => {
    if (latest !== transition) return;
    const target = to();
    if (target) target.style.viewTransitionName = "";
  });
}

export function SampleDocument({ service, name }: { service: ServiceSlug; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const shelf = useRef<HTMLDivElement>(null);
  const { file, Body } = samples[service];
  const titleId = `sample-${service}-title`;
  const transitionName = `sample-${service}`;
  const readerCover = () => dialog.current?.querySelector<HTMLElement>(".faux-cover") ?? null;

  function open() {
    if (dialog.current?.open) return;
    morph(transitionName, shelf.current, readerCover, () => {
      dialog.current?.showModal();
      dialog.current?.querySelector(".sample-pages")?.scrollTo(0, 0);
    });
  }
  function close() {
    const pages = dialog.current?.querySelector(".sample-pages");
    // Only fold back into the shelf when the cover is still in view; otherwise just close.
    const from = pages && pages.scrollTop < 200 ? readerCover() : null;
    morph(
      transitionName,
      from,
      () => shelf.current,
      () => dialog.current?.close(),
    );
  }

  return (
    <>
      {/* The cover is a picture of the sample; the button below is the accessible way in. */}
      <div className="shelf-cover" ref={shelf} aria-hidden="true" onClick={open}>
        <Cover meta={sampleMeta[service]} total={4} />
      </div>
      <button type="button" className="sample-open" onClick={open}>
        View sample<span className="sr-only"> {name} document</span>
      </button>
      <dialog
        ref={dialog}
        className="sample-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        // A click on the backdrop lands on the dialog element itself.
        onClick={(event) => event.target === dialog.current && close()}
      >
        <div className="sample-toolbar">
          <span id={titleId}>{file}</span>
          <span>Sample · placeholder text</span>
          <button type="button" onClick={close}>
            Close<span className="sr-only"> sample</span>
          </button>
        </div>
        {/* The pages scroll on their own, so the region takes keyboard focus. */}
        <div className="sample-pages" tabIndex={0} role="region" aria-labelledby={titleId}>
          <Body />
        </div>
      </dialog>
    </>
  );
}
