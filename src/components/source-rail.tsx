import { publicSources } from "@/data/sources";

export function SourceRail() {
  return (
    <section className="source-rail" aria-labelledby="source-rail-title">
      <div className="source-rail-intro">
        <h2 id="source-rail-title">Built around authoritative Canadian data</h2>
        <p>Public data sources · no endorsement or partnership implied</p>
      </div>
      <div className="source-rail-list">
        {publicSources.map((source) => (
          <a key={source.publisher} href={source.url} target="_blank" rel="noreferrer">
            <span>{source.publisher}</span>
            <small>{source.purpose}</small>
          </a>
        ))}
      </div>
      <p className="source-rail-note">
        Data sources remain the property of their respective publishers.
      </p>
    </section>
  );
}
