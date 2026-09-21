import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";

export const services = [
  {
    slug: "market-scan",
    name: "Canada Market Scan",
    range: "C$250–400",
    description:
      "A focused picture of market structure, trade signals, customer segments, geography, channels and commercial considerations.",
    outputs: ["Market structure and trade indicators", "Customer segments and geographic concentration", "Channel, competitor and commercial observations"],
  },
  {
    slug: "buyer-distributor",
    name: "Buyer & Distributor Intelligence",
    range: "C$300–750",
    description:
      "A manually researched set of Canadian buyers, importers, distributors, retailers or partners relevant to your offer.",
    outputs: ["Company, location, website and business type", "Why each organization may be relevant", "Public evidence and decision-maker information where available"],
  },
  {
    slug: "competitor-intelligence",
    name: "Competitor Intelligence",
    range: "C$300–600",
    description:
      "A sourced review of Canadian competitors, offerings, positioning, channels, geography and observable commercial signals.",
    outputs: ["Competitor and offer landscape", "Channel, geography and pricing indicators", "Supporting sources and clearly marked observations"],
  },
] as const;

export function ServiceList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "service-list service-list-compact" : "service-list"}>
      {services.map((service) => (
        <article className="service-row" key={service.slug} id={service.slug}>
          <div className="service-name">
            <h3>{service.name}</h3>
            <p>Validation range <strong>{service.range}</strong></p>
          </div>
          <div className="service-copy">
            <p>{service.description}</p>
            {!compact && <ul>{service.outputs.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>}
          </div>
          <Link href={`/request-research?service=${service.slug}`} aria-label={`Request ${service.name}`}>
            Request this research <ArrowIcon />
          </Link>
        </article>
      ))}
    </div>
  );
}
