import { afterEach, describe, expect, it, vi } from "vitest";
import { withServices } from "@/server/container";
import { dynamic, GET, runtime } from "./route";

vi.mock("@/server/container", () => ({ withServices: vi.fn() }));
afterEach(() => vi.resetAllMocks());

describe("health route", () => {
  it("runs a database query in a request scope and reports success without caching", async () => {
    const execute = vi.fn(async () => []);
    vi.mocked(withServices).mockImplementation(async work => work({ em: { getConnection: () => ({ execute }) } } as never));
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
    expect(execute).toHaveBeenCalledExactlyOnceWith("select 1");
  });

  it("returns a generic 503 when the database is unavailable", async () => {
    vi.mocked(withServices).mockRejectedValue(new Error("synthetic-private-connection-detail"));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe('{"status":"unavailable"}');
  });

  it("always runs dynamically on the Node.js runtime", () => {
    expect({ runtime, dynamic }).toEqual({ runtime: "nodejs", dynamic: "force-dynamic" });
  });
});
