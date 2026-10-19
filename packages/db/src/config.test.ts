import { describe, expect, it } from "vitest";
import { createDatabaseConfig } from "./config";

describe("database configuration", () => {
  it("requires explicit configuration", () => {
    expect(() => createDatabaseConfig(undefined)).toThrow("DATABASE_URL is required");
  });

  it.each(["postgresql://demo:demo@localhost/demo", "postgres://demo:demo@localhost/demo"])(
    "accepts PostgreSQL URLs without connecting: %s",
    (url) => expect(createDatabaseConfig(url).clientUrl).toBe(url),
  );

  it.each(["invalid", "mysql://demo:demo@localhost/demo"])(
    "rejects invalid configuration without leaking the supplied URL",
    (url) => {
      expect(() => createDatabaseConfig(url)).toThrow(
        /^DATABASE_URL must (be a valid PostgreSQL URL|use PostgreSQL)\.$/,
      );
    },
  );
});
