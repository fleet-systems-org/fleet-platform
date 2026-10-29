import { describe, expect, it } from "vitest";
import { resolveLocalDateTime, toInstant } from "./zoned-time";

describe("resolveLocalDateTime", () => {
  it("finds the one offset of an ordinary local time", () => {
    expect(resolveLocalDateTime("2026-11-12", "09:30", "Europe/Warsaw")).toEqual({ kind: "unique", offset: "+01:00" });
    expect(resolveLocalDateTime("2027-06-01", "09:30", "Europe/Warsaw")).toEqual({ kind: "unique", offset: "+02:00" });
    expect(resolveLocalDateTime("2026-11-12", "09:30", "Europe/London")).toEqual({ kind: "unique", offset: "+00:00" });
    expect(resolveLocalDateTime("2026-11-12", "09:30", "America/St_Johns")).toEqual({ kind: "unique", offset: "-03:30" });
  });

  it("rejects a time the clock skips going forward (TIME-1)", () => {
    expect(resolveLocalDateTime("2027-03-28", "02:30", "Europe/Warsaw")).toEqual({ kind: "nonexistent" });
    expect(resolveLocalDateTime("2027-03-28", "01:59", "Europe/Warsaw")).toEqual({ kind: "unique", offset: "+01:00" });
    expect(resolveLocalDateTime("2027-03-28", "03:00", "Europe/Warsaw")).toEqual({ kind: "unique", offset: "+02:00" });
  });

  it("lists both offsets of a time the clock repeats going back, earlier instant first (TIME-1)", () => {
    expect(resolveLocalDateTime("2027-10-31", "02:30", "Europe/Warsaw")).toEqual({ kind: "ambiguous", offsets: ["+02:00", "+01:00"] });
    expect(resolveLocalDateTime("2026-11-01", "01:30", "America/New_York")).toEqual({ kind: "ambiguous", offsets: ["-04:00", "-05:00"] });
    expect(resolveLocalDateTime("2027-10-31", "03:00", "Europe/Warsaw")).toEqual({ kind: "unique", offset: "+01:00" });
  });
});

describe("toInstant", () => {
  it("gives the exact UTC instant at the offset", () => {
    expect(toInstant("2026-11-12", "09:30", "+01:00")).toBe("2026-11-12T08:30:00.000Z");
    expect(toInstant("2027-10-31", "02:30", "+02:00")).toBe("2027-10-31T00:30:00.000Z");
    expect(toInstant("2027-10-31", "02:30", "+01:00")).toBe("2027-10-31T01:30:00.000Z");
    expect(toInstant("2026-11-12", "09:30", "-03:30")).toBe("2026-11-12T13:00:00.000Z");
  });
});
