import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDatabase } from "./index";

vi.mock("./index", () => ({ createDatabase: vi.fn() }));

function fakeOrm(execute: () => Promise<unknown>) {
  const close = vi.fn(async () => {});
  const orm = { em: { getConnection: () => ({ execute }) }, close } as unknown as Awaited<ReturnType<typeof createDatabase>>;
  return Object.assign(orm, { close });
}
async function runCheck() {
  vi.resetModules();
  await import("./check");
  await vi.waitFor(() => expect(vi.mocked(console.log).mock.calls.length + vi.mocked(console.error).mock.calls.length).toBe(1));
}
beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubEnv("DATABASE_URL", "postgresql://synthetic:synthetic@127.0.0.1/synthetic");
});
afterEach(() => { process.exitCode = undefined; vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("database check command", () => {
  it("queries the database, reports success and closes the connection", async () => {
    const execute = vi.fn(async () => []);
    const orm = fakeOrm(execute);
    vi.mocked(createDatabase).mockResolvedValue(orm);
    await runCheck();
    expect(createDatabase).toHaveBeenCalledWith("postgresql://synthetic:synthetic@127.0.0.1/synthetic");
    expect(execute).toHaveBeenCalledWith("select 1");
    expect(console.log).toHaveBeenCalledWith("PASS: PostgreSQL connection and query.");
    expect(orm.close).toHaveBeenCalledWith(true);
    expect(process.exitCode).toBeUndefined();
  });

  it("closes the connection and fails generically when the query fails", async () => {
    const orm = fakeOrm(async () => { throw new Error("synthetic-private-detail"); });
    vi.mocked(createDatabase).mockResolvedValue(orm);
    await runCheck();
    expect(orm.close).toHaveBeenCalledWith(true);
    expect(console.error).toHaveBeenCalledExactlyOnceWith("FAIL: PostgreSQL check. Verify DATABASE_URL and database availability.");
    expect(process.exitCode).toBe(1);
  });

  it("fails generically when the database cannot be initialized", async () => {
    vi.mocked(createDatabase).mockRejectedValue(new Error("synthetic-private-detail"));
    await runCheck();
    expect(console.error).toHaveBeenCalledExactlyOnceWith("FAIL: PostgreSQL check. Verify DATABASE_URL and database availability.");
    expect(process.exitCode).toBe(1);
  });
});
