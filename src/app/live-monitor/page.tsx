import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowIcon } from "@/components/icons";
import { LiveMonitorPanel, LiveMonitorPanelSkeleton } from "@/components/live-monitor-panel";
import { monitorTopics } from "@/lib/live-monitor";
import "./live-monitor.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Monitor",
  description:
    "Recent Canada–Europe reporting across trade, defence, energy, industry and strategic technology, powered by Currents.",
  alternates: { canonical: "/live-monitor" },
};

export default function LiveMonitorPage() {
  return (
    <>
      <section className="monitor-hero" aria-labelledby="monitor-page-title">
        <div className="monitor-hero-inner">
          <div className="monitor-hero-copy">
            <div className="monitor-hero-state">
              <span aria-hidden="true">
                <i />
              </span>
              Current intelligence · Canada ↔ Europe
            </div>
            <h1 id="monitor-page-title">Signals across the Atlantic.</h1>
            <p>
              Live reporting on the commercial, industrial, technological and strategic relationship
              between Canada and Europe.
            </p>
            <div className="monitor-hero-actions">
              <a className="button-primary" href="#coverage">
                Read current coverage <span aria-hidden="true">↓</span>
              </a>
              <Link className="monitor-hero-link" href="/methodology">
                How sources are handled <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="monitor-signal-field" aria-hidden="true">
            <div className="monitor-signal-head">
              <span>Continuous scan</span>
              <span>7-day window</span>
            </div>
            <svg viewBox="0 0 620 390">
              <path className="signal-route signal-route--base" d="M70 214C176 94 352 94 548 198" />
              <path
                className="signal-route signal-route--active"
                pathLength="1"
                d="M70 214C176 94 352 94 548 198"
              />
              <path
                className="signal-vector"
                d="M154 151L154 276M300 112L300 291M446 150L446 276"
              />
              <circle className="signal-origin" cx="70" cy="214" r="7" />
              <circle className="signal-pulse signal-pulse--one" cx="226" cy="122" r="5" />
              <circle className="signal-pulse signal-pulse--two" cx="387" cy="128" r="5" />
              <circle className="signal-destination" cx="548" cy="198" r="7" />
              <text x="70" y="250">
                CANADA
              </text>
              <text x="491" y="234">
                EUROPE
              </text>
              <text className="signal-caption" x="154" y="302" textAnchor="middle">
                SOURCE
              </text>
              <text className="signal-caption" x="300" y="317" textAnchor="middle">
                CLASSIFY
              </text>
              <text className="signal-caption" x="446" y="302" textAnchor="middle">
                ATTRIBUTE
              </text>
            </svg>
            <ol className="monitor-signal-topics">
              {monitorTopics.map((topic, index) => (
                <li key={topic.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {topic.shortLabel}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="monitor-disclaimer">
        <p>
          Currents powers discovery. Every headline and source link remains attributed to its
          publisher. Inclusion is not verification, endorsement or a Tharros research finding.
        </p>
        <nav aria-label="Live Monitor context">
          <Link href="/research">
            Research archive <ArrowIcon />
          </Link>
          <Link href="/methodology">
            Sources & methodology <ArrowIcon />
          </Link>
        </nav>
      </section>
      <section className="section section--compact monitor-page" id="coverage">
        <Suspense fallback={<LiveMonitorPanelSkeleton />}>
          <LiveMonitorPanel />
        </Suspense>
      </section>
      <section className="monitor-method">
        <div className="monitor-method-statement">
          <h2>Discovery is the beginning of research—not its conclusion.</h2>
        </div>
        <div className="monitor-method-copy">
          <p>
            The monitor searches a rolling seven-day Currents window for reporting that connects
            Canada with Europe across the four Tharros research areas.
          </p>
          <dl>
            <div>
              <dt>Source</dt>
              <dd>Original publisher links remain attached to every dispatch.</dd>
            </div>
            <div>
              <dt>Boundary</dt>
              <dd>No article body is copied and no automated summary becomes Tharros analysis.</dd>
            </div>
            <div>
              <dt>Next step</dt>
              <dd>Formal conclusions belong in commissioned, sourced human research.</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="closing-cta">
        <h2>See a development that matters to your decision?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
