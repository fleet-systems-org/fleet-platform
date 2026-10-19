import { MikroORM } from "@mikro-orm/postgresql";
import { createDatabaseConfig } from "./config";

export { createDatabaseConfig } from "./config";
export type { MikroORM, EntityManager } from "@mikro-orm/postgresql";

export function createDatabase(databaseUrl: string | undefined) {
  return MikroORM.init(createDatabaseConfig(databaseUrl));
}
