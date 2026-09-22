import { describe, expect, it } from "vitest";
import { parseResearchRequest, prefillFromSearchParams, requestResearchHref, validateResearchRequest } from "../src/lib/research-request";

const valid={companyName:"Example GmbH",country:"Germany",email:"market@example.com",product:"Industrial LED lighting",objectives:["Find a distributor or partner"],researchNeed:"Canada / Europe Market Scan",consent:true};

describe("research request validation",()=>{
  it("requires the minimum scoping fields but allows Tharros to classify the format",()=>{
    const errors=validateResearchRequest({});expect(errors.companyName).toBeTruthy();expect(errors.email).toBeTruthy();expect(errors.objectives).toBeTruthy();expect(errors.consent).toBeTruthy();
    expect(errors.researchNeed).toBeUndefined();
    expect(parseResearchRequest({...valid,researchNeed:""}).ok).toBe(true);
  });
  it("accepts a complete request",()=>{expect(parseResearchRequest(valid).ok).toBe(true);});
});
describe("parseResearchRequest (untrusted input)",()=>{
  it("accepts, trims and drops unknown fields",()=>{const result=parseResearchRequest({...valid,companyName:"  Example GmbH ",admin:true,submittedAt:"x"});expect(result.ok).toBe(true);if(!result.ok)return;expect(result.value.companyName).toBe("Example GmbH");expect(result.value).not.toHaveProperty("admin");expect(result.value).not.toHaveProperty("submittedAt");});
  it("rejects non-object bodies",()=>{for(const body of[null,"text",42,[valid]])expect(parseResearchRequest(body).ok).toBe(false);});
  it("rejects wrong primitive types",()=>{for(const patch of[{companyName:{$ne:""}},{email:["market@example.com"]},{objectives:"Find buyers"},{objectives:[1,2]},{consent:"true"},{researchNeed:3}])expect(parseResearchRequest({...valid,...patch}).ok).toBe(false);});
  it("rejects research needs and objectives outside the allowed lists",()=>{expect(parseResearchRequest({...valid,researchNeed:"Free consulting"}).ok).toBe(false);expect(parseResearchRequest({...valid,objectives:["Find buyers","Hack"]}).ok).toBe(false);});
  it("requires consent to be exactly true",()=>{expect(parseResearchRequest({...valid,consent:false}).ok).toBe(false);});
  it("enforces maximum lengths",()=>{expect(parseResearchRequest({...valid,context:"x".repeat(3001)}).ok).toBe(false);expect(parseResearchRequest({...valid,companyName:"x".repeat(161)}).ok).toBe(false);});
  it("validates optional website and HS code",()=>{expect(parseResearchRequest({...valid,website:"javascript:alert(1)"}).ok).toBe(false);expect(parseResearchRequest({...valid,website:"not a url"}).ok).toBe(false);const ok=parseResearchRequest({...valid,website:"example.de"});expect(ok.ok&&ok.value.website).toBe("https://example.de/");expect(parseResearchRequest({...valid,hsCode:"ab12"}).ok).toBe(false);});
  it("rejects malformed email",()=>{expect(parseResearchRequest({...valid,email:"market@example"}).ok).toBe(false);});
});
describe("URL prefill",()=>{
  it("maps a service slug to its research need",()=>{expect(prefillFromSearchParams({service:"buyer-distributor"}).researchNeed).toBe("Canadian Buyer Intelligence");expect(prefillFromSearchParams({service:"nope"}).researchNeed).toBeUndefined();});
  it("sanitizes and truncates free text, ignoring arrays",()=>{const prefill=prefillFromSearchParams({product:`  Solar\u0000 mounts ${"x".repeat(400)}`,context:["a","b"],hs:"<script>"});expect(prefill.product?.startsWith("Solar mounts")).toBe(true);expect(prefill.product!.length).toBeLessThanOrEqual(200);expect(prefill.context).toBeUndefined();expect(prefill.hsCode).toBeUndefined();});
  it("round-trips through requestResearchHref",()=>{const href=requestResearchHref({service:"market-scan",product:"Solar & wind mounts",hs:"7616.99"});const params=Object.fromEntries(new URL(href,"https://tharros.ca").searchParams);expect(prefillFromSearchParams(params)).toEqual({researchNeed:"Canada / Europe Market Scan",product:"Solar & wind mounts",hsCode:"7616.99"});expect(requestResearchHref({})).toBe("/request-research");});
});
