import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowIcon } from "@/components/icons";
import { LiveMonitorPanel, LiveMonitorPanelSkeleton } from "@/components/live-monitor-panel";
import { PageHero } from "@/components/page-hero";
import { monitorTopics } from "@/lib/live-monitor";
import "./live-monitor.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Monitor",
  description: "Recent Canada–Europe reporting across trade, defence, energy, industry and strategic technology, discovered through GDELT.",
  alternates: { canonical: "/live-monitor" },
};

export default function LiveMonitorPage() {
  return (
    <>
      <PageHero
        title="Live Canada–Europe Monitor."
        description="Recent reporting on the commercial, industrial, technological and strategic relationship between Canada and Europe."
        index={monitorTopics.map((topic) => ({ label: topic.label }))}
        indexLabel="Research areas monitored"
        variant="task"
      />
      <section className="section section--compact monitor-page">
        <div className="service-context monitor-intro">
          <p className="pricing-note">GDELT is the primary automated discovery source. If it is unavailable, an attributed news RSS fallback keeps the monitor current. Inclusion is not verification, endorsement or a Tharros research finding.</p>
          <nav className="context-links" aria-label="Live Monitor context">
            <Link href="/research">Research archive <ArrowIcon /></Link>
            <Link href="/methodology">Sources & methodology <ArrowIcon /></Link>
          </nav>
        </div>
        <Suspense fallback={<LiveMonitorPanelSkeleton />}>
          <LiveMonitorPanel />
        </Suspense>
      </section>
      <section className="about-independence">
        <div><p>Monitor method</p><h2>Discovery is not verification.</h2></div>
        <div>
          <p>The monitor searches a rolling seven-day window across the same four research areas used throughout Tharros Canada. Source identity and time context stay visible with each result, and the active provider is labelled above the feed.</p>
          <p>No article body is copied and no automated summary is presented as Tharros analysis. Formal conclusions belong in sourced Tharros research.</p>
        </div>
      </section>
      <section className="closing-cta">
        <h2>See a development that matters to your decision?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
