import "server-only";
import { z } from "zod";
import { apiHandler, ApiHttpError, assertEmptyQuery, readJson, readQuery, type HttpDependencies, type RequestScope, type RouteContext } from "./api-handler";

export type ScopedRecord = { id: string; tenantId: string };
export type TenantFilter = Readonly<{ tenantId: string }>;
export type RecordFilter = Readonly<{ tenantId: string; id: string }>;
export type CrudService<T extends ScopedRecord, C, U> = {
  list: (where: TenantFilter, pagination: { offset: number; limit: number }, scope: RequestScope) => Promise<{ items: T[]; total: number }>;
  get: (where: RecordFilter, scope: RequestScope) => Promise<T | null>;
  create: (data: C & { tenantId: string }, scope: RequestScope) => Promise<T>;
  update: (where: RecordFilter, data: U, scope: RequestScope) => Promise<T | null>;
  remove: (where: RecordFilter, scope: RequestScope) => Promise<T | null>;
};

const idSchema = z.strictObject({ id: z.string().min(1).max(200) });
const paginationSchema = z.strictObject({
  offset: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)).default(0),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(100)).default(20),
});

export function makeCrudRoute<T extends ScopedRecord, C extends Record<string, unknown>, U extends Record<string, unknown>>(options: {
  model: { name: string; output: z.ZodType<T> };
  createSchema: z.ZodObject<z.ZodRawShape, z.core.$strict> & z.ZodType<C>;
  updateSchema: z.ZodObject<z.ZodRawShape, z.core.$strict> & z.ZodType<U>;
  service: CrudService<T, C, U>;
  dependencies: HttpDependencies;
  permissions: { list: string; get: string; create: string; update: string; remove: string };
}) {
  const { service, dependencies, permissions, model } = options;
  const tenantWhere = (scope: RequestScope): TenantFilter => Object.freeze({ tenantId: scope.tenantId });
  const recordWhere = (scope: RequestScope, id: string): RecordFilter => Object.freeze({ tenantId: scope.tenantId, id });
  const checked = (record: T | null, scope: RequestScope, id?: string): T => {
    if (!record) throw new ApiHttpError(404, "NOT_FOUND", "api.notFound");
    if (record.tenantId !== scope.tenantId || (id !== undefined && record.id !== id)) throw new Error("Service scope violation");
    return record;
  };
  const readId = async (request: Request, context: RouteContext) => {
    assertEmptyQuery(request);
    return context.params;
  };
  const readMutation = async (request: Request) => {
    assertEmptyQuery(request);
    const body = await readJson(request);
    if (typeof body === "object" && body !== null && ["tenantId", "tenant_id", "id"].some(key => Object.hasOwn(body, key))) {
      throw new ApiHttpError(400, "PROTECTED_FIELD", "api.validation");
    }
    return body;
  };
  // Strict schemas also reject unknown fields. Protected keys cannot enter via transforms/defaults.
  for (const schema of [options.createSchema, options.updateSchema]) {
    if (["tenantId", "tenant_id", "id"].some(key => Object.hasOwn(schema.shape, key))) throw new Error("Protected CRUD schema field");
  }
  return {
    collection: {
      GET: apiHandler({ dependencies, method: "GET", permission: permissions.list, input: paginationSchema,
        output: z.object({ items: z.array(model.output), total: z.number().int().nonnegative() }),
        readInput: async request => readQuery(request),
        run: async (pagination, scope) => {
          const result = await service.list(tenantWhere(scope), pagination, scope);
          return { ...result, items: result.items.map(item => checked(item, scope)) };
        } }),
      POST: apiHandler({ dependencies, method: "POST", permission: permissions.create, input: options.createSchema,
        output: model.output, successStatus: 201, readInput: readMutation,
        run: async (data, scope) => checked(await service.create({ ...data, tenantId: scope.tenantId }, scope), scope) }),
    },
    item: {
      GET: apiHandler({ dependencies, method: "GET", permission: permissions.get, input: idSchema, output: model.output,
        readInput: readId, run: async ({ id }, scope) => checked(await service.get(recordWhere(scope, id), scope), scope, id) }),
      PATCH: apiHandler({ dependencies, method: "PATCH", permission: permissions.update,
        input: z.strictObject({ params: idSchema, body: options.updateSchema }), output: model.output,
        readInput: async (request, context) => ({ params: await context.params, body: await readMutation(request) }),
        run: async ({ params, body }, scope) => checked(await service.update(recordWhere(scope, params.id), body, scope), scope, params.id) }),
      DELETE: apiHandler({ dependencies, method: "DELETE", permission: permissions.remove, input: idSchema,
        output: z.object({ id: z.string() }), readInput: readId,
        run: async ({ id }, scope) => ({ id: checked(await service.remove(recordWhere(scope, id), scope), scope, id).id }) }),
    },
  };
}
