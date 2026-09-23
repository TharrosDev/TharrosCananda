import Link from "next/link";
import { type MonitorArticle, monitorTopics } from "@/lib/live-monitor";
import { topicVolume, topSources } from "@/lib/monitor-view";

/** Coverage context: 7-day volume per research area, top sources and how classification works. */
export function MonitorContext({ articles, referenceTime }: { articles: MonitorArticle[]; referenceTime: number }) {
  const volume = topicVolume(articles, referenceTime, 7);
  const peak = Math.max(1, ...Object.values(volume).flat());
  const sources = topSources(articles, 5);

  return (
    <aside className="monitor-context" aria-label="Coverage context">
      <section>
        <h3>Stories per day, last 7 days</h3>
        <ul className="monitor-volume" aria-hidden="true">
          {monitorTopics.map((topic) => (
            <li key={topic.id}>
              <span>{topic.shortLabel}</span>
              <svg viewBox="0 0 70 24" preserveAspectRatio="none">
                {volume[topic.id].map((count, day) => (
                  <rect key={day} x={day * 10 + 2} width="6" y={24 - Math.max((count / peak) * 22, 2)} height={Math.max((count / peak) * 22, 2)} className={count ? "" : "is-empty"} />
                ))}
              </svg>
              <strong>{volume[topic.id].reduce((a, b) => a + b, 0)}</strong>
            </li>
          ))}
        </ul>
        {/* Tables ignore the 1px sr-only box, so the wrapper carries it (otherwise the page overflows). */}
        <div className="sr-only">
        <table>
          <caption>Stories per research area for each of the last 7 days, oldest first</caption>
          <thead>
            <tr><th scope="col">Area</th>{volume[monitorTopics[0].id].map((_, day) => <th key={day} scope="col">{day === 6 ? "Today" : `${6 - day} days ago`}</th>)}</tr>
          </thead>
          <tbody>
            {monitorTopics.map((topic) => (
              <tr key={topic.id}><th scope="row">{topic.label}</th>{volume[topic.id].map((count, day) => <td key={day}>{count}</td>)}</tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
      {sources.length > 0 && (
        <section>
          <h3>Top sources</h3>
          <ol className="monitor-top-sources">
            {sources.map((source) => <li key={source.domain}><span>{source.domain}</span><strong>{source.count}</strong></li>)}
          </ol>
        </section>
      )}
      <section>
        <h3>How stories are classified</h3>
        <p>
          Each story is matched to research areas by whole-word keywords in its headline and description, plus the categories Currents supplies.{" "}
          <Link href="/methodology">Methodology</Link>
        </p>
        <p className="monitor-caveat">Up to 20 stories per refresh; counts are indicative, not market statistics.</p>
      </section>
    </aside>
  );
}
