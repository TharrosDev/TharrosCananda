import { describe, expect, it } from "vitest";
import { oneLine, parseIntake } from "../supabase/functions/research-intake/payload";

const valid={reference:"0b6f1c2e-3d4a-4b5c-8d9e-0f1a2b3c4d5e",submittedAt:"2026-09-23T12:00:00.000Z",companyName:"Example GmbH",country:"Germany",website:"",email:"market@example.com",product:"Industrial LED lighting",industry:"",description:"",hsCode:"",objectives:["Find a distributor or partner"],researchNeed:"",context:"",consent:true,source:"tharros.ca"};

describe("research-intake payload (signed, but checked before storing)",()=>{
  it("accepts the body the site sends",()=>{expect(parseIntake(JSON.stringify(valid))?.reference).toBe(valid.reference);});
  it("rejects non-object and malformed bodies",()=>{for(const body of["null","[]","42","not json"])expect(parseIntake(body)).toBeNull();});
  it("rejects missing or mistyped fields that would fail the insert or the email",()=>{
    for(const patch of[{objectives:undefined},{objectives:[1]},{submittedAt:"yesterday"},{companyName:""},{email:undefined},{reference:"x"},{country:3}])
      expect(parseIntake(JSON.stringify({...valid,...patch}))).toBeNull();
  });
  it("keeps email subjects on one line",()=>{expect(oneLine("Acme\r\nBcc: x@y.z\t")).toBe("Acme Bcc: x@y.z");});
});
