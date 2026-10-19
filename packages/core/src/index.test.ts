import { expect, it } from "vitest";
import { Decimal } from "./index";

// Arithmetic precision and rounding remain an owner decision; this only checks the exported type.
it("exports decimal.js, which keeps decimal digits that binary numbers lose", () => {
  expect(new Decimal("0.1").plus("0.2").toString()).toBe("0.3");
  expect(new Decimal("12345678901234567890.12").toFixed()).toBe("12345678901234567890.12");
});
