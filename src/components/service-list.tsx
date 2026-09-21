import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { requestResearchHref } from "@/lib/research-request";
import { services } from "@/lib/services";

export function ServiceList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "service-list service-list-compact" : "service-list"}>
      {services.map((service) => (
        <article className="service-row" key={service.slug} id={service.slug}>
          <div className="service-name">
            <h3>{service.name}</h3>
            <p>Indicative price <strong>{service.priceLabel}</strong></p>
          </div>
          <div className="service-copy">
            <p className="service-question">{service.question}</p>
            <p>{service.description}</p>
            {compact && <p className="service-excludes"><strong>Not included:</strong> {service.excludes}</p>}
            {!compact && (
              <>
                <h4>What you receive</h4>
                <ul>{service.outputs.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
                <dl className="service-terms">
                  <div><dt>Verification</dt><dd>{service.verification}</dd></div>
                  <div><dt>Not included</dt><dd>{service.excludes}</dd></div>
                </dl>
              </>
            )}
          </div>
          <Link href={requestResearchHref({ service: service.slug })}>
            Request this research<span className="sr-only">: {service.name}</span> <ArrowIcon />
          </Link>
        </article>
      ))}
    </div>
  );
}
