import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { requestResearchHref } from "@/lib/research-request";
import { buyerIntelligenceTiers, serviceGroups, services, type Service } from "@/lib/services";

const groupId = (name: string) => `group-${name.replace(/\W+/g, "-").toLowerCase()}`;
// Word joiners keep a price range from breaking at its dash.
const price = (label: string) => label.replace("–", "\u2060–\u2060");

/** All services side by side: the decision each answers, a starting price and a direct request link. */
export function ServiceComparison() {
  return (
    <table className="service-table">
      <caption className="sr-only">Research services compared</caption>
      <thead>
        <tr>
          <th scope="col">Service</th>
          <th scope="col">The question it answers</th>
          <th scope="col">Price</th>
          <th scope="col">
            <span className="sr-only">Request</span>
          </th>
        </tr>
      </thead>
      {serviceGroups.map((group) => (
        <tbody key={group.name}>
          <tr className="service-table-group">
            <th colSpan={4} scope="colgroup">
              {group.name}
            </th>
          </tr>
          {services
            .filter((service) => service.group === group.name)
            .map((service) => (
              <tr key={service.slug} className={service.flagship ? "is-flagship" : undefined}>
                <th scope="row">
                  <a href={`#${service.slug}`}>{service.name}</a>
                  {service.flagship && <span className="service-flag">Flagship</span>}
                </th>
                <td>{service.question}</td>
                <td className="service-table-price">{service.priceFrom}</td>
                <td>
                  <Link
                    className="service-request"
                    href={requestResearchHref({ service: service.slug })}
                  >
                    Request<span className="sr-only"> {service.name}</span> <ArrowIcon />
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      ))}
    </table>
  );
}

function ServiceEntry({ service }: { service: Service }) {
  return (
    <article
      className={service.flagship ? "service-entry is-flagship" : "service-entry"}
      id={service.slug}
    >
      <header className="service-entry-head">
        {service.flagship && <span className="service-flag">Flagship product</span>}
        <h3>{service.name}</h3>
        <p className="service-entry-price">
          {(service.flagship ? service.priceFrom : service.priceLabel).split(" · ").map((part) => (
            <span key={part}>{price(part)}</span>
          ))}
        </p>
      </header>
      <div className="service-entry-body">
        {/* The comparison table carries every question; only the flagship repeats its pitch. */}
        {service.flagship && <p className="service-question">{service.question}</p>}
        <p className="service-receive-label">You receive</p>
        <ul className="service-outputs">
          {service.outputs.map((item) => (
            <li key={item}>
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>
        {service.flagship && (
          <>
            <ol className="buyer-tiers" aria-label="Coverage tiers">
              {buyerIntelligenceTiers.map((tier) => (
                <li key={tier.name}>
                  <strong>{tier.name}</strong>
                  <span className="tier-price">{tier.price}</span>
                  <span className="tier-targets">Up to {tier.maxTargets} qualified targets</span>
                  <small>{tier.bestFor}</small>
                </li>
              ))}
            </ol>
            <p className="tier-note">
              Package totals are maximums. Reports include only relevant, verified targets.
            </p>
          </>
        )}
        <details className="service-scope">
          <summary>Scope and exclusions</summary>
          <dl>
            <div>
              <dt>Typical scope</dt>
              <dd>{service.formSummary}</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>{service.excludes}</dd>
            </div>
          </dl>
        </details>
      </div>
      <Link
        className={
          service.flagship
            ? "button-primary service-entry-action"
            : "button-secondary service-entry-action"
        }
        href={requestResearchHref({ service: service.slug })}
      >
        Request<span className="sr-only"> {service.name}</span> <ArrowIcon />
      </Link>
    </article>
  );
}

export function ServiceList() {
  return (
    <div className="service-groups">
      {serviceGroups.map((group) => (
        <section className="service-group" key={group.name} aria-labelledby={groupId(group.name)}>
          <header className="service-group-heading">
            <h2 id={groupId(group.name)}>{group.name}</h2>
            <p>{group.description}</p>
          </header>
          <div className="service-list">
            {services
              .filter((service) => service.group === group.name)
              .map((service) => (
                <ServiceEntry key={service.slug} service={service} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
