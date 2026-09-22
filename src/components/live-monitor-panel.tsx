import { LiveMonitorFeed } from "@/components/live-monitor-feed";
import { getLiveMonitor } from "@/lib/gdelt-data";

export async function LiveMonitorPanel() {
  const data = await getLiveMonitor();
  return <LiveMonitorFeed data={data} />;
}

export function LiveMonitorPanelSkeleton() {
  return (
    <section className="monitor-loading" data-loading aria-label="Loading live coverage">
      <div className="monitor-status-line"><span>Loading current coverage</span><span>GDELT</span></div>
      <div className="archive-controls monitor-controls" aria-hidden="true">
        <div className="monitor-skeleton-field" />
        <div className="monitor-skeleton-field" />
        <div className="monitor-skeleton-field" />
      </div>
      <ol className="archive-list monitor-loading-list" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <li key={item}>
            <span className="monitor-skeleton-line monitor-skeleton-meta" />
            <span className="monitor-skeleton-line monitor-skeleton-title" />
            <span className="monitor-skeleton-line monitor-skeleton-source" />
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">Loading current Canada–Europe coverage.</p>
    </section>
  );
}
