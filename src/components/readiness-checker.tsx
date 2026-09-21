"use client";

import { useMemo, useState } from "react";
import { CheckIcon } from "@/components/icons";

const issues = {
  "Own store": ["GST/HST registration thresholds and collection", "Non-resident importer arrangements", "Returns and Canadian consumer expectations"],
  Marketplace: ["Marketplace tax collection responsibilities", "Seller account and product-category requirements", "Inventory and returns ownership"],
  Wholesale: ["Importer of record and landed-cost terms", "Canadian distributor margin and territory", "Product-specific documentation"],
  "Direct B2B": ["Contracting and Incoterms", "HS classification and preferential tariff treatment", "After-sales support across Canada"],
} as const;

export function ReadinessChecker() {
  const [product, setProduct] = useState("Physical consumer product");
  const [country, setCountry] = useState("Germany");
  const [channel, setChannel] = useState<keyof typeof issues>("Own store");
  const output = useMemo(() => issues[channel], [channel]);

  return (
    <div className="readiness-tool">
      <div className="readiness-inputs">
        <label><span>Product type</span><select value={product} onChange={(e) => setProduct(e.target.value)}><option>Physical consumer product</option><option>Industrial product</option><option>Food or beverage</option><option>Digital service</option></select></label>
        <label><span>Country</span><input value={country} onChange={(e) => setCountry(e.target.value)} /></label>
        <label><span>Initial channel</span><select value={channel} onChange={(e) => setChannel(e.target.value as keyof typeof issues)}>{Object.keys(issues).map((key) => <option key={key}>{key}</option>)}</select></label>
      </div>
      <div className="readiness-output" aria-live="polite">
        <div><span>Information check</span><strong>{channel} from {country}</strong><small>{product}</small></div>
        <h2>Issues to investigate before launch</h2>
        <ul>{output.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <p>This is informational signposting—not legal, tax, customs, or regulatory advice. Verify requirements with official sources and qualified professionals.</p>
      </div>
    </div>
  );
}
