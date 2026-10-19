import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { apiCall, apiCallOrThrow, ApiCallError } from "./apiCall";

const parser = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), data: z.object({ amount: z.string() }) }),
  z.object({ ok: z.literal(false), error: z.object({ code: z.string(), messageKey: z.string(), fieldErrors: z.record(z.string(), z.array(z.string())).optional() }) }),
]);
afterEach(() => vi.unstubAllGlobals());
describe("apiCall", () => {
  it("retains decimal strings and sends credentials, abort signal and CSRF centrally", async () => {
    const fetch = vi.fn(async () => Response.json({ ok: true, data: { amount: "12345678901234567890.12" } }));
    vi.stubGlobal("fetch", fetch);
    const controller = new AbortController();
    expect(await apiCall("/api/synthetic", { parser, method: "POST", body: { amount: "0.00" }, csrfToken: "synthetic", signal: controller.signal }))
      .toEqual({ ok: true, data: { amount: "12345678901234567890.12" } });
    const init = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(init[1]).toMatchObject({ credentials: "same-origin", redirect: "error", body: '{"amount":"0.00"}', signal: controller.signal });
    expect(new Headers(init[1].headers).get("X-CSRF-Token")).toBe("synthetic");
  });
  it("preserves validated server field errors", async () => {
    const result = { ok: false, error: { code: "VALIDATION_ERROR", messageKey: "api.validation", fieldErrors: { amount: ["validation.invalid"] } } };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(result, { status: 400 })));
    expect(await apiCall("/api/synthetic", { parser })).toEqual(result);
    await expect(apiCallOrThrow("/api/synthetic", { parser })).rejects.toBeInstanceOf(ApiCallError);
  });
  it.each([
    () => new Response("<html>failure</html>", { status: 502 }),
    () => Response.json({ ok: true, data: { amount: 1 } }),
    () => Response.json({ ok: true, data: { amount: "1.00" } }, { status: 500 }),
    () => Response.json({ ok: false, error: { code: "FAIL", messageKey: "api.internal" } }),
  ])("rejects invalid payload/status combinations", async response => {
    vi.stubGlobal("fetch", vi.fn(async () => response()));
    expect(await apiCall("/api/synthetic", { parser })).toMatchObject({ ok: false, error: { code: "PROTOCOL_ERROR" } });
  });
  it("treats a throwing response parser as a protocol failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ ok: true, data: { amount: "1.00" } })));
    const throwing = { safeParse: () => { throw new Error("synthetic parser failure"); } };
    expect(await apiCall("/api/synthetic", { parser: throwing })).toEqual({ ok: false, error: { code: "PROTOCOL_ERROR", messageKey: "api.protocol" } });
  });
  it("returns validated data from apiCallOrThrow on success", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ ok: true, data: { amount: "0.10" } })));
    expect(await apiCallOrThrow("/api/synthetic", { parser })).toEqual({ amount: "0.10" });
  });
  it("handles network errors and cancellation without throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    expect(await apiCall("/api/synthetic", { parser })).toMatchObject({ ok: false, error: { code: "NETWORK_ERROR" } });
    const controller = new AbortController(); controller.abort();
    expect(await apiCall("/api/synthetic", { parser, signal: controller.signal })).toMatchObject({ ok: false, error: { code: "ABORTED" } });
  });
  it("recognizes cancellation while reading the response body", async () => {
    const response = Response.json({});
    vi.spyOn(response, "json").mockRejectedValue(new DOMException("Aborted", "AbortError"));
    vi.stubGlobal("fetch", vi.fn(async () => response));
    expect(await apiCall("/api/synthetic", { parser })).toMatchObject({ ok: false, error: { code: "ABORTED" } });
  });
  it("refuses external URLs without invoking fetch", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    for (const path of ["https://outside.invalid/api/test", "//outside.invalid/api/test", "/api/\\outside.invalid", "/admin", "/api/../admin", "http://["]) {
      expect(await apiCall(path, { parser })).toMatchObject({ ok: false, error: { code: "INVALID_PATH" } });
    }
    expect(fetch).not.toHaveBeenCalled();
  });
});
