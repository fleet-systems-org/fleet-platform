import { describe, expect, it } from "vitest";
import { decimalStringSchema } from "./decimal.schema";

describe("exact decimal transport", () => {
  it.each(["0", "0.00", "-0.001", "123456789012345678901234567890.12345678901234567890"])(
    "preserves every digit of %s", value => {
      expect(decimalStringSchema.parse(value)).toBe(value);
    },
  );
  it.each([0, 1.25, null, undefined, NaN, Infinity, "NaN", "Infinity", "1e3", "1,25", " 1", "1 ", "1\n", "1\r\n", "", ".5", "1.", "01", "+1"])(
    "rejects noncanonical or non-string input %s", value => {
      expect(decimalStringSchema.safeParse(value).success).toBe(false);
    },
  );
});
