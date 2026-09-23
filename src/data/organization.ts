/**
 * Accountability details for About, the footer and structured data.
 * Every field is empty until verified information is supplied; empty fields render nothing.
 * Do not add anything here that cannot be confirmed (names, titles, registration, addresses, profiles).
 */

export type ProfileLink = { label: string; url: string };

export type Organization = {
  /** The person accountable for the research. */
  lead: { name: string; role: string; bio: string; links: ProfileLink[] } | null;
  /** Legal entity details, exactly as registered. */
  legal: {
    legalName: string;
    jurisdiction?: string;
    registration?: string;
    address?: string;
  } | null;
  /** Company profiles (e.g. LinkedIn company page), only once they exist. */
  profiles: ProfileLink[];
  /** How long the intake receiver keeps submitted requests, e.g. "24 months after the last contact". */
  intakeRetention: string | null;
};

export const organization: Organization = {
  lead: null,
  legal: null,
  profiles: [],
  intakeRetention: null,
};

/** schema.org Organization with only the fields that are actually set. */
export function organizationJsonLd(
  org: Organization,
  { url, email }: { url: string; email: string | null },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tharros Canada",
    url,
    description: "Independent research organization focused on Canada–Europe relations.",
    ...(email ? { email } : {}),
    ...(org.legal ? { legalName: org.legal.legalName } : {}),
    ...(org.legal?.address ? { address: org.legal.address } : {}),
    ...(org.lead
      ? {
          founder: {
            "@type": "Person",
            name: org.lead.name,
            jobTitle: org.lead.role,
            ...(org.lead.links.length ? { sameAs: org.lead.links.map((link) => link.url) } : {}),
          },
        }
      : {}),
    ...(org.profiles.length ? { sameAs: org.profiles.map((link) => link.url) } : {}),
  };
}
