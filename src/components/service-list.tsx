import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { requestResearchHref } from "@/lib/research-request";
import { buyerIntelligenceTiers, serviceGroups, services } from "@/lib/services";

export function ServiceList() {
  return (
    <div className="service-groups">
      {serviceGroups.map((group) => (
        <section className="service-group" key={group.name} aria-labelledby={`group-${group.name.replace(/\W+/g, "-").toLowerCase()}`}>
          <header className="service-group-heading">
            <h2 id={`group-${group.name.replace(/\W+/g, "-").toLowerCase()}`}>{group.name}</h2>
            <p>{group.description}</p>
          </header>
          <div className="service-list">
            {services.filter((service) => service.group === group.name).map((service) => (
              <article className={service.flagship ? "service-row service-row-flagship" : "service-row"} key={service.slug} id={service.slug}>
                <div className="service-name">
                  {service.flagship && <span className="service-flag">Flagship product</span>}
                  <h3>{service.name}</h3>
                  <p>{service.priceLabel}</p>
                </div>
                <div className="service-copy">
                  <p className="service-question">{service.question}</p>
                  <ul>{service.outputs.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
                  {service.flagship && (
                    <div className="buyer-tiers" aria-label="Canadian Buyer Intelligence tiers">
                      {buyerIntelligenceTiers.map((tier) => (
                        <div key={tier.name}>
                          <strong>{tier.name}</strong>
                          <span>Up to {tier.maxTargets} qualified targets · {tier.price}</span>
                          <small>{tier.bestFor}</small>
                        </div>
                      ))}
                      <p><strong>Quality rule:</strong> relevance over volume. If fewer strong matches exist than the package maximum, Tharros delivers the strongest verified targets rather than padding the report.</p>
                    </div>
                  )}
                  <p className="service-excludes"><strong>Not included:</strong> {service.excludes}</p>
                </div>
                <Link href={requestResearchHref({ service: service.slug })}>Request<span className="sr-only"> {service.name}</span> <ArrowIcon /></Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
