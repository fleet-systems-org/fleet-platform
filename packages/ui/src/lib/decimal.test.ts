import { describe, expect, it } from "vitest";
import { formatDecimal, parseDecimalInput } from "./decimal";

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
    expect(parseDecimalInput(text)).toEqual({ ok: true, value });
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
    expect(parseDecimalInput(text)).toEqual({ ok: false, reason });
  });

  it("accepts a sign only where the feature allows it", () => {
    expect(parseDecimalInput("-12,50", { signed: true })).toEqual({ ok: true, value: "-12.50" });
  });

  it("rejects more decimals than the scale instead of rounding them", () => {
    expect(parseDecimalInput("1850,005", { scale: 2 })).toEqual({ ok: false, reason: "scale" });
    expect(parseDecimalInput("1850,00", { scale: 2 })).toEqual({ ok: true, value: "1850.00" });
    expect(parseDecimalInput("1850", { scale: 2 })).toEqual({ ok: true, value: "1850" });
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
