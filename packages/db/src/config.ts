import { defineConfig } from "@mikro-orm/postgresql";

export function createDatabaseConfig(databaseUrl: string | undefined) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database operations.");
  }

  let protocol: string;
  try {
    protocol = new URL(databaseUrl).protocol;
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL.");
  }
  if (protocol !== "postgresql:" && protocol !== "postgres:") {
    throw new Error("DATABASE_URL must use PostgreSQL.");
  }

  return defineConfig({
    clientUrl: databaseUrl,
    entities: [],
    discovery: { warnWhenNoEntities: false },
    ensureDatabase: false,
    pool: { min: 0, max: 10 },
    driverOptions: { connectionTimeoutMillis: 5000 },
    debug: false,
  });
}
