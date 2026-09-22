import { LiveMonitorFeed } from "@/components/live-monitor-feed";
import { getLiveMonitor } from "@/lib/currents-data";

export async function LiveMonitorPanel() {
  const data = await getLiveMonitor();
  return <LiveMonitorFeed data={data} />;
}

export function LiveMonitorPanelSkeleton() {
  return (
    <section className="monitor-loading" data-loading aria-label="Loading live coverage">
      <div className="monitor-loading-minimal">
        <div className="monitor-loading-status">
          <i aria-hidden="true" />
          Opening the signal desk
        </div>
        <h2>Preparing current coverage.</h2>
        <p>Recent reporting and original publisher links will appear here.</p>
      </div>
      <p className="sr-only" aria-live="polite">
        Loading current Canada–Europe coverage from Currents.
      </p>
    </section>
  );
}
