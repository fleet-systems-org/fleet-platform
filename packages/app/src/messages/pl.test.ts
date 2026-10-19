import { describe, expect, it } from "vitest";
import { apiMessages, crudFormMessages, dataTableMessages, translateApiMessage } from "./pl";

describe("Polish messages", () => {
  it("translates known API keys", () => {
    expect(translateApiMessage("api.notFound")).toBe(apiMessages["api.notFound"]);
  });

  it.each(["api.synthetic-unknown", "toString", "__proto__"])("falls back to the generic failure for %s", key => {
    expect(translateApiMessage(key)).toBe(apiMessages["api.internal"]);
  });

  it("supplies shared UI labels", () => {
    expect(crudFormMessages.translate).toBe(translateApiMessage);
    expect(dataTableMessages.page(2, 5)).toBe("Strona 2 z 5");
  });
});
