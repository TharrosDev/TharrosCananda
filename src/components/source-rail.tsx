import { publicSources } from "@/data/sources";

export function SourceRail() {
  return (
    <section className="source-rail" aria-labelledby="source-rail-title">
      <div className="source-rail-intro">
        <h2 id="source-rail-title">Research designed around official Canadian sources</h2>
        <p>Publishers Tharros research draws on. Explorer samples on this site use synthetic values.</p>
      </div>
      <div className="source-rail-list">
        {publicSources.map((source) => (
          <a key={source.publisher} href={source.url} target="_blank" rel="noreferrer">
            <span>{source.publisher}<span className="sr-only"> (opens in a new tab)</span></span>
            <small>{source.purpose}</small>
          </a>
        ))}
      </div>
      <p className="source-rail-note">
        Publisher names are shown for attribution only. No endorsement by, or partnership with, these organizations is implied.
      </p>
    </section>
  );
}
