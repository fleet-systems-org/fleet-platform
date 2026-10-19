import { afterEach, expect, it, vi } from "vitest";
import { MikroORM } from "@mikro-orm/postgresql";
import { createDatabase } from "./index";

vi.mock("@mikro-orm/postgresql", async original => ({
  ...await original<typeof import("@mikro-orm/postgresql")>(),
  MikroORM: { init: vi.fn(async () => "synthetic-orm") },
}));
afterEach(() => vi.clearAllMocks());

it("initializes MikroORM with the validated configuration", async () => {
  await expect(createDatabase("postgresql://synthetic:synthetic@127.0.0.1/synthetic")).resolves.toBe("synthetic-orm");
  expect(MikroORM.init).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
    clientUrl: "postgresql://synthetic:synthetic@127.0.0.1/synthetic", entities: [], ensureDatabase: false,
  }));
});

it("rejects missing configuration before connecting", () => {
  expect(() => createDatabase(undefined)).toThrow("DATABASE_URL is required");
  expect(MikroORM.init).not.toHaveBeenCalled();
});
