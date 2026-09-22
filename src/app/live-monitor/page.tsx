import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { LiveMonitorFeed } from "@/components/live-monitor-feed";
import { getLiveMonitor } from "@/lib/gdelt";
import { monitorTopics } from "@/lib/live-monitor";
import "./live-monitor.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Monitor",
  description: "A live Canada–Europe monitor of recent reporting across trade, defence, energy, industry and strategic technology, powered by GDELT.",
  alternates: { canonical: "/live-monitor" },
};

function retrievedLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Retrieval time unavailable";
  return date.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Toronto",
    timeZoneName: "short",
  });
}

export default async function LiveMonitorPage() {
  const data = await getLiveMonitor();
  const recentCutoff = Date.parse(data.retrievedAt) - 24 * 60 * 60 * 1000;
  const last24 = data.articles.filter((article) => Date.parse(article.seenAt) >= recentCutoff).length;
  const activeTopics = monitorTopics.filter((topic) => data.articles.some((article) => article.topics.includes(topic.id)));

  return (
    <>
      <header className="monitor-hero">
        <div className="monitor-hero-copy">
          <p>Live Monitor</p>
          <h1>Canada–Europe developments, as they are reported.</h1>
          <p className="monitor-hero-deck">A live discovery layer for reporting on the commercial, industrial, technological and strategic relationship between Canada and Europe.</p>
        </div>
        <div className="monitor-hero-readout" aria-label="Live Monitor status">
          <div><span>Coverage</span><strong>{last24}</strong><small>items indexed in the last 24 hours</small></div>
          <div><span>Research areas</span><strong>{activeTopics.length}/{monitorTopics.length}</strong><small>{activeTopics.length ? activeTopics.map((topic) => topic.shortLabel).join(" · ") : "Awaiting coverage"}</small></div>
          <div><span>Source</span><strong>GDELT</strong><small>Global news discovery</small></div>
        </div>
      </header>

      <section className="monitor-ticker" aria-label="Monitor provenance">
        <span className="monitor-live-dot">Live discovery</span>
        <span>7-day rolling coverage</span>
        <span data-volatile>Retrieved {retrievedLabel(data.retrievedAt)}</span>
        <span>Original publisher links</span>
      </section>

      <section className="monitor-context">
        <div><p>What this is</p><h2>A current-source radar, not a Tharros news desk.</h2></div>
        <div><p>GDELT is used to discover recent reporting that matches Tharros Canada’s research areas. Headlines and source metadata remain attributed to their original publishers.</p><p>Inclusion does not mean Tharros has verified, endorsed or adopted an article’s claims. Published Tharros analysis remains separate in the <Link href="/research">Research archive <ArrowIcon /></Link>.</p></div>
      </section>

      <div className="monitor-shell">
        <LiveMonitorFeed data={data} />
      </div>

      <section className="monitor-method">
        <div>
          <p>Monitor method</p>
          <h2>Broad discovery. Narrow interpretation.</h2>
        </div>
        <div className="monitor-method-grid">
          <div><span>01</span><h3>Search the relationship</h3><p>Queries require Canadian and European context, then apply one of the four Tharros research-area lenses.</p></div>
          <div><span>02</span><h3>Keep provenance visible</h3><p>The monitor shows publisher domain, source country, language and GDELT’s indexed time with every headline.</p></div>
          <div><span>03</span><h3>Do not manufacture analysis</h3><p>No article body is copied and no automated summary is presented as a Tharros finding. Readers open the original source.</p></div>
          <div><span>04</span><h3>Separate monitoring from research</h3><p>The monitor helps identify developments worth investigating. Formal conclusions belong in sourced Tharros research.</p></div>
        </div>
        <p className="monitor-attribution">Coverage discovery is powered by the <a href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">GDELT Project <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></a>. GDELT and the publishers surfaced by the monitor do not endorse Tharros Canada.</p>
      </section>

      <section className="closing-cta">
        <h2>See a development that matters to your decision?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
