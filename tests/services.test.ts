import { describe, expect, it } from "vitest";
import { buyerIntelligenceTiers, researchNeeds, serviceBySlug, services } from "../src/lib/services";

describe("service definitions",()=>{
  it("maps every slug to a research need offered by the form",()=>{
    for(const service of services){expect(serviceBySlug(service.slug)?.name).toBe(service.name);expect(researchNeeds).toContain(service.name);}
    expect(researchNeeds.at(-1)).toBe("Not sure yet");expect(researchNeeds).toHaveLength(services.length+1);
  });
  it("keeps the flagship Buyer Intelligence coverage tiers explicit",()=>{
    expect(serviceBySlug("buyer-distributor")?.flagship).toBe(true);
    expect(buyerIntelligenceTiers.map((tier)=>tier.price)).toEqual(["C$295","C$495","C$695"]);
  });
  it("ignores unknown or non-string slugs",()=>{expect(serviceBySlug("unknown")).toBeUndefined();expect(serviceBySlug(["market-scan"])).toBeUndefined();expect(serviceBySlug(undefined)).toBeUndefined();});
});
