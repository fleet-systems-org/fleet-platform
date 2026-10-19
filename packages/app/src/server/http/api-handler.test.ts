import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApplicationError, type ApplicationErrorCode } from "@fleet-platform/core/contracts/application-error";
import { apiHandler } from "./api-handler";

vi.mock("server-only", () => ({}));
afterEach(() => vi.restoreAllMocks());

function route(run: () => Promise<string>) {
  return apiHandler({
    dependencies: {
      authenticate: async () => ({ tenantId: "synthetic-company", actorId: "synthetic-actor" }),
      authorize: async () => true,
      verifyMutation: async () => false,
    },
    method: "GET", permission: "synthetic.read",
    input: z.strictObject({}), output: z.string(),
    readInput: async () => ({}), run,
  });
}

describe("application failure boundary", () => {
  it.each<[ApplicationErrorCode, number, string]>([
    ["NOT_FOUND", 404, "api.notFound"],
    ["FORBIDDEN", 403, "api.forbidden"],
    ["UNAUTHENTICATED", 401, "api.unauthenticated"],
    ["CONFLICT", 409, "api.conflict"],
    ["VALIDATION_ERROR", 400, "api.validation"],
  ])("maps %s without coupling the use case to HTTP", async (code, status, messageKey) => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await route(async () => { throw new ApplicationError(code); })(new Request("https://example.test/api/synthetic"));
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ ok: false, error: { code, messageKey, correlationId: response.headers.get("X-Correlation-ID") } });
    expect(log).not.toHaveBeenCalled();
  });

  it("reports unexpected failures using only a safe code and matching correlation ID", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await route(async () => { throw new Error("synthetic-private-provider-detail"); })(new Request("https://example.test/api/synthetic?private=synthetic"));
    const correlationId = response.headers.get("X-Correlation-ID");
    expect(correlationId).toEqual(expect.any(String));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, error: { code: "INTERNAL_ERROR", messageKey: "api.internal", correlationId } });
    expect(log).toHaveBeenCalledExactlyOnceWith({ code: "INTERNAL_ERROR", correlationId });
  });
});
