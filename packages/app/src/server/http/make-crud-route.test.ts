import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { apiResultSchema } from "@fleet-platform/core/contracts/api";
import { decimalStringSchema } from "@fleet-platform/core/contracts/decimal";
import { apiCall } from "@fleet-platform/ui/backend/api";
import { apiHandler, ApiHttpError, type HttpDependencies } from "./api-handler";
import { makeCrudRoute, type CrudService } from "./make-crud-route";

vi.mock("server-only", () => ({}));

const output = z.strictObject({ id: z.string(), tenantId: z.string(), label: z.string(), amount: decimalStringSchema });
const input = z.strictObject({ label: z.string().min(1), amount: decimalStringSchema });
type Row = z.infer<typeof output>;
type Input = z.infer<typeof input>;
const sessions = new Map([
  ["session-a", { tenantId: "company-a", actorId: "actor-a" }],
  ["session-b", { tenantId: "company-b", actorId: "actor-b" }],
]);
function fixture() {
  const rows: Row[] = [
    { id: "a", tenantId: "company-a", label: "Synthetic A", amount: "12345678901234567890.12" },
    { id: "b", tenantId: "company-b", label: "Synthetic B", amount: "0.00" },
  ];
  const dependencies: HttpDependencies = {
    authenticate: vi.fn(async request => sessions.get(request.headers.get("Authorization") ?? "") ?? null),
    authorize: vi.fn(async () => true),
    verifyMutation: vi.fn(async request => request.headers.get("Origin") === "https://example.test" && request.headers.get("X-CSRF-Token") === "synthetic-csrf"),
  };
  const service: CrudService<Row, Input, Partial<Input>> = {
    list: vi.fn(async (where, { offset, limit }) => {
      const found = rows.filter(row => row.tenantId === where.tenantId);
      return { items: found.slice(offset, offset + limit), total: found.length };
    }),
    get: vi.fn(async where => rows.find(row => row.tenantId === where.tenantId && row.id === where.id) ?? null),
    create: vi.fn(async data => { const row = { ...data, id: "created" }; rows.push(row); return row; }),
    update: vi.fn(async (where, data) => {
      const row = rows.find(row => row.tenantId === where.tenantId && row.id === where.id);
      if (!row) return null;
      Object.assign(row, data); return row;
    }),
    remove: vi.fn(async where => {
      const index = rows.findIndex(row => row.tenantId === where.tenantId && row.id === where.id);
      return index === -1 ? null : rows.splice(index, 1)[0];
    }),
  };
  const routes = makeCrudRoute({ model: { name: "synthetic", output }, createSchema: input,
    updateSchema: input.partial(), service, dependencies,
    permissions: { list: "synthetic.list", get: "synthetic.get", create: "synthetic.create", update: "synthetic.update", remove: "synthetic.remove" } });
  return { rows, dependencies, service, routes };
}
const request = (method = "GET", body?: unknown, session = "session-a", query = "") => new Request(`https://example.test/api/synthetic${query}`, {
  method, headers: { Authorization: session, Origin: "https://example.test", "X-CSRF-Token": "synthetic-csrf", "Content-Type": "application/json" },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
const context = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => vi.restoreAllMocks());

describe("centralized tenant-scoped CRUD", () => {
  it("isolates interleaved tenant lists and totals; injects trusted scope into every query", async () => {
    const { routes, service } = fixture();
    const results = await Promise.all(["session-a", "session-b", "session-a"].map(session => routes.collection.GET(request("GET", undefined, session)).then(r => r.json())));
    expect(results.map(result => result.data.items.map((r: Row) => r.id))).toEqual([["a"], ["b"], ["a"]]);
    expect(results.map(result => result.data.total)).toEqual([1, 1, 1]);
    expect(service.list).toHaveBeenCalledWith({ tenantId: "company-a" }, { offset: 0, limit: 20 }, { tenantId: "company-a", actorId: "actor-a" });
  });
  it("allows own records and denies foreign read/update/delete without side effects", async () => {
    const { routes, rows } = fixture();
    expect((await routes.item.GET(request(), context("a"))).status).toBe(200);
    expect((await routes.item.GET(request(), context("b"))).status).toBe(404);
    expect((await routes.item.PATCH(request("PATCH", { label: "Changed" }), context("b"))).status).toBe(404);
    expect((await routes.item.DELETE(request("DELETE"), context("b"))).status).toBe(404);
    expect(rows.find(r => r.id === "b")?.label).toBe("Synthetic B");
  });
  it("creates, updates and removes within server-selected tenant; preserves exact decimals", async () => {
    const { routes, service } = fixture();
    const created = await routes.collection.POST(request("POST", { label: "New", amount: "99999999999999999999.99" }));
    expect(created.status).toBe(201);
    expect((await created.json()).data).toMatchObject({ tenantId: "company-a", amount: "99999999999999999999.99" });
    expect(service.create).toHaveBeenCalledWith({ tenantId: "company-a", label: "New", amount: "99999999999999999999.99" }, { tenantId: "company-a", actorId: "actor-a" });
    expect((await routes.item.PATCH(request("PATCH", { amount: "0.00" }), context("created"))).status).toBe(200);
    expect((await routes.item.DELETE(request("DELETE"), context("created"))).status).toBe(200);
    expect((await routes.item.GET(request(), context("created"))).status).toBe(404);
  });
  it("rejects forged tenant fields, unknown input and numeric money before the service", async () => {
    const { routes, service } = fixture();
    for (const body of [{ label: "New", amount: "1.00", tenantId: "company-b" }, { label: "New", amount: "1.00", admin: true }, { label: "New", amount: 1 }]) {
      expect((await routes.collection.POST(request("POST", body))).status).toBe(400);
    }
    expect(service.create).not.toHaveBeenCalled();
    expect((await routes.item.PATCH(request("PATCH", { tenant_id: "company-b" }), context("a"))).status).toBe(400);
    expect(service.update).not.toHaveBeenCalled();
    const forged = request(); forged.headers.set("X-Tenant-ID", "company-b");
    expect((await (await routes.collection.GET(forged)).json()).data.items[0].tenantId).toBe("company-a");
  });
  it("rejects missing auth, permission and CSRF before service access", async () => {
    const { routes, dependencies, service } = fixture();
    expect((await routes.collection.GET(request("GET", undefined, "unknown"))).status).toBe(401);
    vi.mocked(dependencies.authorize).mockResolvedValueOnce(false);
    expect((await routes.collection.GET(request())).status).toBe(403);
    const unsafe = request("POST", { label: "New", amount: "1.00" }); unsafe.headers.delete("X-CSRF-Token");
    expect((await routes.collection.POST(unsafe)).status).toBe(403);
    expect(service.list).not.toHaveBeenCalled(); expect(service.create).not.toHaveBeenCalled();
  });
  it("refuses invalid server identity and verifies CSRF on update/delete too", async () => {
    const { routes, dependencies, service } = fixture();
    vi.mocked(dependencies.authenticate).mockResolvedValueOnce({ tenantId: "", actorId: "actor-a" });
    expect((await routes.collection.GET(request())).status).toBe(401);
    for (const method of ["PATCH", "DELETE"] as const) {
      const unsafe = request(method, method === "PATCH" ? { label: "New" } : undefined);
      unsafe.headers.set("Origin", "https://outside.invalid");
      expect((await routes.item[method](unsafe, context("a"))).status).toBe(403);
    }
    expect(service.update).not.toHaveBeenCalled(); expect(service.remove).not.toHaveBeenCalled();
  });
  it("validates query bounds, duplicate keys and scope injection", async () => {
    const { routes, service } = fixture();
    for (const query of ["?tenantId=company-b", "?limit=101", "?offset=-1", "?limit=1&limit=2", "?sort=tenantId"]) {
      expect((await routes.collection.GET(request("GET", undefined, "session-a", query))).status).toBe(400);
    }
    expect(service.list).not.toHaveBeenCalled();
    expect((await (await routes.collection.GET(request("GET", undefined, "session-a", "?offset=1&limit=1"))).json()).data).toEqual({ items: [], total: 1 });
  });
  it("maps malformed JSON, method mismatch and field errors consistently", async () => {
    const { routes } = fixture();
    const malformed = new Request(request("POST"), { body: "{" });
    expect((await routes.collection.POST(malformed)).status).toBe(400);
    const wrongType = request("POST", {}); wrongType.headers.set("Content-Type", "text/plain");
    expect((await routes.collection.POST(wrongType)).status).toBe(415);
    expect((await routes.collection.GET(request("DELETE"))).status).toBe(405);
    const invalid = await routes.collection.POST(request("POST", { label: "", amount: "wrong" }));
    expect((await invalid.json()).error.fieldErrors).toEqual({ label: ["validation.invalid"], amount: ["validation.invalid"] });
  });
  it("refuses accidental cross-tenant service output and hides internal errors", async () => {
    const { routes, service, rows } = fixture();
    vi.mocked(service.get).mockResolvedValueOnce(rows[1]);
    const leaked = await routes.item.GET(request(), context("a"));
    expect(leaked.status).toBe(500); expect(JSON.stringify(await leaked.json())).not.toContain("Synthetic B");
    vi.mocked(service.list).mockRejectedValueOnce(new Error("synthetic-private-diagnostic"));
    const failure = await routes.collection.GET(request());
    expect(failure.status).toBe(500);
    expect(await failure.json()).toEqual({ ok: false, error: { code: "INTERNAL_ERROR", messageKey: "api.internal", correlationId: failure.headers.get("X-Correlation-ID") } });
  });
  it("validates service output and maps explicit conflicts", async () => {
    const { routes, service } = fixture();
    vi.mocked(service.list).mockResolvedValueOnce({ items: [], total: -1 });
    expect((await routes.collection.GET(request())).status).toBe(500);
    vi.mocked(service.update).mockRejectedValueOnce(new ApiHttpError(409, "CONFLICT", "api.conflict"));
    expect((await routes.item.PATCH(request("PATCH", { label: "New" }), context("a"))).status).toBe(409);
  });
  it("runs the browser helper against the synthetic route with the shared envelope parser", async () => {
    const { routes } = fixture();
    vi.stubGlobal("fetch", vi.fn(async (_path: string, init: RequestInit) => {
      const incoming = new Request("https://example.test/api/synthetic", init);
      incoming.headers.set("Authorization", "session-a");
      return routes.collection.GET(incoming);
    }));
    try {
      const result = await apiCall("/api/synthetic", { parser: apiResultSchema(z.object({ items: z.array(output), total: z.number() })) });
      expect(result).toMatchObject({ ok: true, data: { total: 1, items: [{ amount: "12345678901234567890.12" }] } });
    } finally { vi.unstubAllGlobals(); }
  });
  it("supports explicit non-CRUD operations through apiHandler", async () => {
    const { dependencies } = fixture();
    const command = apiHandler({ dependencies, method: "POST", permission: "synthetic.command", input: z.strictObject({}),
      output: z.object({ accepted: z.boolean() }), readInput: async () => ({}), run: async () => ({ accepted: true }) });
    expect(await (await command(request("POST"))).json()).toEqual({ ok: true, data: { accepted: true } });
    expect(dependencies.authorize).toHaveBeenCalledWith({ tenantId: "company-a", actorId: "actor-a" }, "synthetic.command");
  });
});
