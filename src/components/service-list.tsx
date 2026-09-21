import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { requestResearchHref } from "@/lib/research-request";
import { services } from "@/lib/services";

export function ServiceList() {
  return (
    <div className="service-list">
      {services.map((service) => (
        <article className="service-row" key={service.slug} id={service.slug}>
          <div className="service-name">
            <h2>{service.name}</h2>
            <p>{service.priceLabel}</p>
          </div>
          <div className="service-copy">
            <p className="service-question">{service.question}</p>
            <ul>{service.outputs.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
            <p className="service-excludes"><strong>Not included:</strong> {service.excludes}</p>
          </div>
          <Link href={requestResearchHref({ service: service.slug })}>
            Request<span className="sr-only"> {service.name}</span> <ArrowIcon />
          </Link>
        </article>
      ))}
    </div>
  );
}
