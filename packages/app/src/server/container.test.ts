import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDatabase } from "@fleet-platform/db";
import { withServices } from "./container";

vi.mock("server-only", () => ({}));
vi.mock("@fleet-platform/db", () => ({ createDatabase: vi.fn() }));

const cache = globalThis as { fleetContainer?: unknown };
function fakeOrm() {
  let forks = 0;
  return { em: { fork: vi.fn(() => ({ fork: ++forks })) } } as unknown as Awaited<ReturnType<typeof createDatabase>>;
}
beforeEach(() => { delete cache.fleetContainer; vi.stubEnv("DATABASE_URL", "postgresql://synthetic:synthetic@127.0.0.1/synthetic"); });
afterEach(() => { delete cache.fleetContainer; vi.unstubAllEnvs(); vi.resetAllMocks(); });

describe("withServices", () => {
  it("initializes the database once and gives each request scope its own EntityManager", async () => {
    const orm = fakeOrm();
    vi.mocked(createDatabase).mockResolvedValue(orm);
    const first = await withServices(async services => {
      expect(services.orm).toBe(orm);
      expect(services.em).toBe(services.em);
      return services.em;
    });
    const second = await withServices(async ({ em }) => em);
    expect(first).not.toBe(second);
    expect(createDatabase).toHaveBeenCalledExactlyOnceWith("postgresql://synthetic:synthetic@127.0.0.1/synthetic");
  });

  it("propagates work failures and keeps the initialized container", async () => {
    vi.mocked(createDatabase).mockResolvedValue(fakeOrm());
    await expect(withServices(async () => { throw new Error("synthetic work failure"); })).rejects.toThrow("synthetic work failure");
    await expect(withServices(async () => "next")).resolves.toBe("next");
    expect(createDatabase).toHaveBeenCalledOnce();
  });

  it("forgets a failed initialization so the next request can retry", async () => {
    vi.mocked(createDatabase).mockRejectedValueOnce(new Error("synthetic connection failure")).mockResolvedValueOnce(fakeOrm());
    await expect(withServices(async () => "unreachable")).rejects.toThrow("synthetic connection failure");
    expect(cache.fleetContainer).toBeUndefined();
    await expect(withServices(async () => "recovered")).resolves.toBe("recovered");
    expect(createDatabase).toHaveBeenCalledTimes(2);
  });
});
