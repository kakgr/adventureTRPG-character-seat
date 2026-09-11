import { describe, expect, it } from "vitest";
import { normalizeCurrency } from "./currency";

describe("currency", () => {
  it("keeps the single numerical amount as non-negative integer", () => {
    expect(normalizeCurrency(123.6)).toBe(124);
    expect(normalizeCurrency(-10)).toBe(0);
  });

  it("converts the legacy denominations into one copper-based amount", () => {
    expect(normalizeCurrency({ platinum: 1, gold: 2, silver: 3, copper: 4 })).toBe(1020304);
  });

  it("accepts an amount object from an intermediate saved format", () => {
    expect(normalizeCurrency({ amount: 250 })).toBe(250);
  });
});
