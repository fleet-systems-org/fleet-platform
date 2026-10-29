import { describe, expect, it } from "vitest";
import { formatLocalDate, parseLocalDate, parseLocalTime, resolveLocalDateTime, toInstant } from "./zoned-time";

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

describe("Polish text forms", () => {
  it.each([
    ["12.11.2026", "2026-11-12"],
    [" 2.1.2027 ", "2027-01-02"],
    ["29.02.2028", "2028-02-29"],
    ["31.02.2027", null],
    ["29.02.2027", null],
    ["12.13.2026", null],
    ["0.11.2026", null],
    ["12.11.26", null],
    ["2026-11-12", null],
    ["12/11/2026", null],
    ["01.01.0050", null],
  ])("reads the date %j as %j", (text, date) => {
    expect(parseLocalDate(text)).toBe(date);
  });

  it.each([
    ["09:30", "09:30"],
    ["9:30", "09:30"],
    ["00:00", "00:00"],
    ["23:59", "23:59"],
    ["24:00", null],
    ["12:60", null],
    ["9.30", null],
    ["930", null],
    ["2:30 PM", null],
  ])("reads the time %j as %j", (text, time) => {
    expect(parseLocalTime(text)).toBe(time);
  });

  it("shows an ISO date the Polish way", () => {
    expect(formatLocalDate("2026-11-12")).toBe("12.11.2026");
  });
});
