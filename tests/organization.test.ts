import { describe, expect, it } from "vitest";
import { organization, organizationJsonLd } from "../src/data/organization";

describe("organizationJsonLd", () => {
  it("emits only the fields that are set", () => {
    const data = organizationJsonLd(organization, { url: "https://tharros.ca", email: null });
    expect(Object.keys(data).sort()).toEqual([
      "@context",
      "@id",
      "@type",
      "areaServed",
      "description",
      "knowsAbout",
      "logo",
      "name",
      "url",
    ]);
  });

  it("includes verified details once supplied", () => {
    const data = organizationJsonLd(
      {
        lead: {
          name: "A. Person",
          role: "Research lead",
          bio: "Bio.",
          links: [{ label: "LinkedIn", url: "https://example.com/p" }],
        },
        legal: { legalName: "Example Research Inc." },
        profiles: [{ label: "LinkedIn", url: "https://example.com/c" }],
        intakeRetention: null,
      },
      { url: "https://tharros.ca", email: "research@example.com" },
    );
    expect(data).toMatchObject({
      email: "research@example.com",
      legalName: "Example Research Inc.",
      founder: { name: "A. Person", jobTitle: "Research lead", sameAs: ["https://example.com/p"] },
      sameAs: ["https://example.com/c"],
    });
    expect(data).not.toHaveProperty("address");
  });
});
