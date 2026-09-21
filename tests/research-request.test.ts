import { describe, expect, it } from "vitest";
import { validateResearchRequest } from "../src/lib/research-request";

describe("research request validation", () => {
  it("requires the minimum scoping fields", () => {
    const errors = validateResearchRequest({});
    expect(errors.companyName).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.objectives).toBeTruthy();
  });

  it("accepts a complete request", () => {
    const errors = validateResearchRequest({
      companyName: "Example GmbH",
      country: "Germany",
      email: "market@example.com",
      product: "Industrial LED lighting",
      objectives: ["Find a distributor"],
      researchNeed: "Canada Market Scan",
      consent: true,
    });
    expect(errors).toEqual({});
  });
});
