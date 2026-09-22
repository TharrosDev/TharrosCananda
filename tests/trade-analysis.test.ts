import { describe, expect, it } from "vitest";
import { yearAgoChange } from "../src/lib/trade-analysis";
import type { TradePoint } from "../src/types/official-data";
const point=(period:string,valueCad:number):TradePoint=>({period,valueCad,rawValue:valueCad,scalarFactorCode:0,releaseTime:"",statusCode:0});
describe("trade analysis",()=>{
  it("matches the exact month one year earlier rather than relying on array position",()=>{expect(yearAgoChange([point("2025-08-01",100),point("2026-01-01",40),point("2026-08-01",125)])).toBe(25);});
  it("returns null when the comparison month is missing or zero",()=>{expect(yearAgoChange([point("2026-08-01",125)])).toBeNull();expect(yearAgoChange([point("2025-08-01",0),point("2026-08-01",125)])).toBeNull();});
});
