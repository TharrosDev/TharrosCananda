"use client";

export default function MarketDataError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page-shell explorer-page">
      <section className="official-explorer" role="alert">
        <div className="official-data-error">
          <h2>The market data page could not load.</h2>
          <p>No figures are shown. Try again, or come back shortly.</p>
          <p><button type="button" className="button-secondary" onClick={reset}>Try again</button></p>
        </div>
      </section>
    </div>
  );
}
