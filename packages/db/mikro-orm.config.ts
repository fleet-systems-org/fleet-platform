import { fileURLToPath } from "node:url";
import { Migrator } from "@mikro-orm/migrations";
import { createDatabaseConfig } from "./src/config";

const config = {
  ...createDatabaseConfig(process.env.DATABASE_URL),
  extensions: [Migrator],
  migrations: {
    path: fileURLToPath(new URL("./src/migrations", import.meta.url)),
    emit: "ts" as const,
    transactional: true,
    allOrNothing: true,
  },
};

export default config;
