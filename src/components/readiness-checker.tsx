"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";

// Only the sales channel changes the question set; product and country are handled in scoped research, not here.
const questions = {
  "Own online store": ["GST/HST registration thresholds and collection", "Non-resident importer arrangements", "Returns and Canadian consumer expectations"],
  Marketplace: ["Marketplace tax collection responsibilities", "Seller account and product-category requirements", "Inventory and returns ownership"],
  Wholesale: ["Importer of record and landed-cost terms", "Canadian distributor margin and territory", "Product-specific documentation"],
  "Direct B2B": ["Contracting and Incoterms", "HS classification and preferential tariff treatment", "After-sales support across Canada"],
} as const;

type Channel = keyof typeof questions;

export function ReadinessChecker() {
  const [channel, setChannel] = useState<Channel>("Own online store");

  return (
    <div className="readiness-tool">
      <div className="readiness-inputs">
        <label>
          <span>Initial sales channel</span>
          <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
            {Object.keys(questions).map((key) => <option key={key}>{key}</option>)}
          </select>
        </label>
        <p className="readiness-note">
          The checklist changes by channel only. Product- and country-specific requirements need case-by-case review.
        </p>
      </div>
      <div className="readiness-output" aria-live="polite">
        <div><span>Route questions</span><strong>{channel}</strong></div>
        <h2>Questions to investigate before launch</h2>
        <ul>{questions[channel].map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <p>This is informational signposting, not legal, tax, customs or regulatory advice. Verify requirements with official sources and qualified professionals.</p>
      </div>
    </div>
  );
}
