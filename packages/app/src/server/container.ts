import "server-only";
import { asFunction, asValue, createContainer, type AwilixContainer } from "awilix";
import { createDatabase, type EntityManager, type MikroORM } from "@fleet-platform/db";

interface Services {
  orm: MikroORM;
  em: EntityManager;
}

// Cache the initialization promise, including across development hot reloads.
const cache = globalThis as typeof globalThis & {
  fleetContainer?: Promise<AwilixContainer<Services>>;
};

async function createAppContainer() {
  const orm = await createDatabase(process.env.DATABASE_URL);
  return createContainer<Services>({ strict: true }).register({
    orm: asValue(orm),
    em: asFunction(({ orm }: Services) => orm.em.fork()).scoped(),
  });
}

export async function withServices<T>(work: (services: Services) => Promise<T>): Promise<T> {
  cache.fleetContainer ??= createAppContainer().catch((error: unknown) => {
    delete cache.fleetContainer;
    throw error;
  });
  const scope = (await cache.fleetContainer).createScope();
  try {
    return await work(scope.cradle);
  } finally {
    await scope.dispose();
  }
}
