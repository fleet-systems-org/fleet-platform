import { describe, expect, it } from "vitest";
import { decimalScales, formatDecimal, parseDecimalInput } from "./decimal";

describe("parseDecimalInput", () => {
  it.each([
    ["1850,00", "1850.00"],
    ["1 850,00", "1850.00"],
    ["1 850,5", "1850.5"],
    ["1850.25", "1850.25"],
    ["0", "0"],
    ["-0,00", "0.00"],
    ["  72  ", "72"],
  ])("normalizes %j to %j as text", (text, value) => {
    expect(parseDecimalInput(text, { kind: "amount" })).toEqual({ ok: true, value });
  });

  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["1.850,00", "format"],
    ["1,850,00", "format"],
    ["12a", "format"],
    [",5", "format"],
    ["007", "format"],
    ["1e3", "format"],
    ["-12,50", "negative"],
  ])("rejects %j as %s", (text, reason) => {
    expect(parseDecimalInput(text, { kind: "amount" })).toEqual({ ok: false, reason });
  });

  it("accepts a sign only where the feature allows it", () => {
    expect(parseDecimalInput("-12,50", { kind: "amount", signed: true })).toEqual({ ok: true, value: "-12.50" });
  });

  it("takes the scale from the kind of value (FIN-3) and rejects more decimals instead of rounding them", () => {
    expect(decimalScales).toEqual({ eurAmount: 2, amount: undefined, unitPrice: 6, fxRate: 6, consumption: 6, kilometres: 3, litres: 3 });
    expect(parseDecimalInput("1850,005", { kind: "eurAmount" })).toEqual({ ok: false, reason: "scale" });
    expect(parseDecimalInput("1850,00", { kind: "eurAmount" })).toEqual({ ok: true, value: "1850.00" });
    expect(parseDecimalInput("1,5123401", { kind: "unitPrice" })).toEqual({ ok: false, reason: "scale" });
    expect(parseDecimalInput("1,512340", { kind: "unitPrice" })).toEqual({ ok: true, value: "1.512340" });
    expect(parseDecimalInput("412,3001", { kind: "kilometres" })).toEqual({ ok: false, reason: "scale" });
    expect(parseDecimalInput("412,300", { kind: "litres" })).toEqual({ ok: true, value: "412.300" });
    // Amounts in another source currency keep any scale.
    expect(parseDecimalInput("7850,12345", { kind: "amount" })).toEqual({ ok: true, value: "7850.12345" });
  });
});

describe("formatDecimal", () => {
  it("shows every published decimal with Polish separators", () => {
    expect(formatDecimal("1234.567")).toBe("1 234,567");
    expect(formatDecimal("72")).toBe("72");
    expect(formatDecimal("1840.00")).toBe("1 840,00");
  });

  it("rounds for display with ties away from zero (FIN-3)", () => {
    expect(formatDecimal("1234.567", { scale: 0 })).toBe("1 235");
    expect(formatDecimal("2.5", { scale: 0 })).toBe("3");
    expect(formatDecimal("-2.5", { scale: 0 })).toBe("-3");
    expect(formatDecimal("1.005", { scale: 2 })).toBe("1,01");
  });

  it("keeps long values exact and never shows negative zero", () => {
    expect(formatDecimal("123456789012345678901.5", { scale: 0 })).toBe("123 456 789 012 345 678 902");
    expect(formatDecimal("-0.4", { scale: 0 })).toBe("0");
    expect(formatDecimal("-0.00")).toBe("0,00");
  });
});
