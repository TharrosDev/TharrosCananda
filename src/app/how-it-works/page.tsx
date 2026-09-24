import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { MethodRail } from "@/components/method-rail";
import { PageHero } from "@/components/page-hero";
import {
  commissionPrivacy,
  commissionSteps as steps,
  doesNotProvide,
  provides,
} from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "How Commissioned Research Works",
  description:
    "How Tharros Canada scopes, prices, sources, verifies and delivers commissioned research: written scope first, work only after approval, and private to the client unless they choose to publish.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        variant="document"
        title="How commissioned research works."
        description={`Scope, price and timing are agreed in writing before work begins. ${commissionPrivacy}`}
        record={[
          { label: "Account", value: "Not required" },
          { label: "Price", value: "Set per case, in writing" },
          { label: "Work starts", value: "After you approve the scope" },
        ]}
      />
      <div className="document-body">
        <MethodRail
          items={[
            ...steps.map(([title], position) => ({ id: `step-${position + 1}`, label: title })),
            { id: "provides", label: "Tharros provides" },
            { id: "does-not-provide", label: "Tharros does not provide" },
          ]}
          label="Sections"
        />
        <div className="document-sheet">
          {steps.map(([title, copy], index) => (
            <article key={title} id={`step-${index + 1}`}>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
          <article id="provides">
            <h2>Tharros provides</h2>
            <ul className="is-grid">
              {provides.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article id="does-not-provide">
            <h2>Tharros does not provide</h2>
            <ul className="is-grid">
              {doesNotProvide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
      <section className="closing-cta">
        <h2>Start with the question.</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
