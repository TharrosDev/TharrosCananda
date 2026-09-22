import { LiveMonitorFeed } from "@/components/live-monitor-feed";
import { getLiveMonitor } from "@/lib/gdelt-data";

export async function LiveMonitorPanel() {
  const data = await getLiveMonitor();
  return <LiveMonitorFeed data={data} />;
}

export function LiveMonitorPanelSkeleton() {
  const stages = [
    ["01", "Connect to live sources"],
    ["02", "Match research areas"],
    ["03", "Prepare source links"],
  ] as const;

  return (
    <section className="monitor-loading" data-loading aria-label="Loading live coverage">
      <div className="monitor-loading-card">
        <div className="monitor-loading-heading">
          <span className="monitor-loading-signal" aria-hidden="true"><i /></span>
          <div>
            <p>Live Monitor</p>
            <h2>Scanning current Canada–Europe coverage.</h2>
            <p>Connecting to live news sources, organizing recent reporting and preserving attribution.</p>
          </div>
        </div>
        <div className="monitor-loading-progress" aria-hidden="true"><span /></div>
        <ol className="monitor-loading-stages" aria-hidden="true">
          {stages.map(([number, label], index) => (
            <li key={number} className={index === 0 ? "is-active" : ""}>
              <span>{number}</span><strong>{label}</strong><small>{index === 0 ? "Working" : "Queued"}</small>
            </li>
          ))}
        </ol>
      </div>
      <div className="monitor-loading-preview" aria-hidden="true">
        <div className="archive-controls monitor-controls">
          <div className="monitor-skeleton-field" />
          <div className="monitor-skeleton-field" />
          <div className="monitor-skeleton-field" />
        </div>
        <ol className="archive-list monitor-loading-list">
          {[0, 1, 2].map((item) => (
            <li key={item}>
              <span className="monitor-skeleton-line monitor-skeleton-meta" />
              <span className="monitor-skeleton-line monitor-skeleton-title" />
              <span className="monitor-skeleton-line monitor-skeleton-source" />
            </li>
          ))}
        </ol>
      </div>
      <p className="sr-only" aria-live="polite">Loading current Canada–Europe coverage.</p>
    </section>
  );
}
