import { describe, expect, it } from "vitest";
import { buildCoordinate, commodityOptions, scalarMultiplier } from "../src/lib/statcan";

const dimensions = [
  {
    dimensionPositionId: 1,
    dimensionNameEn: "Trade",
    member: [
      { memberId: 1, memberNameEn: "Imports" },
      { memberId: 2, memberNameEn: "Exports" },
    ],
  },
  {
    dimensionPositionId: 2,
    dimensionNameEn: "Free trade agreement",
    member: [
      { memberId: 1, memberNameEn: "Total" },
      { memberId: 7, parentMemberId: 1, memberNameEn: "Canada-European Union Comprehensive Economic and Trade Agreement (CETA)" },
    ],
  },
  {
    dimensionPositionId: 3,
    dimensionNameEn: "Commodity",
    member: [
      { memberId: 1, memberNameEn: "Total commodities" },
      { memberId: 10, parentMemberId: 1, memberNameEn: "Food products" },
      { memberId: 20, parentMemberId: 1, memberNameEn: "Industrial products" },
    ],
  },
];

describe("Statistics Canada adapter helpers", () => {
  it("applies Statistics Canada scalar-factor codes", () => {
    expect(scalarMultiplier(0)).toBe(1);
    expect(scalarMultiplier(3)).toBe(1000);
    expect(scalarMultiplier(6)).toBe(1_000_000);
  });

  it("builds a 10-position WDS coordinate and fills unselected dimensions with totals", () => {
    const coordinate = buildCoordinate(
      dimensions,
      new Map([
        [1, dimensions[0].member[1]],
        [2, dimensions[1].member[1]],
      ]),
    );
    expect(coordinate).toBe("2.7.1.0.0.0.0.0.0.0");
  });

  it("derives commodity options from publisher metadata rather than hard-coded product claims", () => {
    expect(commodityOptions(dimensions[2])).toEqual([
      { id: "1", label: "Total commodities" },
      { id: "10", label: "Food products" },
      { id: "20", label: "Industrial products" },
    ]);
  });
});
