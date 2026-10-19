import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { ApplicationError, type ApplicationErrorCode } from "@fleet-platform/core/contracts/application-error";

const applicationFailures = {
  NOT_FOUND: { status: 404, messageKey: "api.notFound" },
  FORBIDDEN: { status: 403, messageKey: "api.forbidden" },
  UNAUTHENTICATED: { status: 401, messageKey: "api.unauthenticated" },
  CONFLICT: { status: 409, messageKey: "api.conflict" },
  VALIDATION_ERROR: { status: 400, messageKey: "api.validation" },
} satisfies Record<ApplicationErrorCode, { status: number; messageKey: string }>;

export type RequestScope = Readonly<{ tenantId: string; actorId: string }>;
export type RouteContext = { params: Promise<Record<string, string>> };
export type HttpDependencies = {
  // Implement from verified server-side membership, never a client tenant header.
  authenticate: (request: Request) => Promise<RequestScope | null>;
  authorize: (scope: RequestScope, permission: string) => Promise<boolean>;
  verifyMutation: (request: Request, scope: RequestScope) => Promise<boolean>;
};

export class ApiHttpError extends Error {
  constructor(public readonly status: 400 | 401 | 403 | 404 | 409 | 415,
    public readonly code: string, public readonly messageKey: string) {
    super(code);
  }
}

const scopeSchema = z.strictObject({ tenantId: z.string().min(1), actorId: z.string().min(1) });
const empty = z.strictObject({});

export function apiHandler<I, O>(options: {
  dependencies: HttpDependencies;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  permission: string;
  input: z.ZodType<I>;
  output: z.ZodType<O>;
  readInput: (request: Request, context: RouteContext) => Promise<unknown>;
  run: (input: I, scope: RequestScope) => Promise<O>;
  successStatus?: 200 | 201;
}) {
  return async (request: Request, context: RouteContext = { params: Promise.resolve({}) }) => {
    const correlationId = randomUUID();
    const headers = { "Cache-Control": "no-store", "X-Correlation-ID": correlationId };
    const fail = (status: number, code: string, messageKey: string, fieldErrors?: Record<string, string[]>) =>
      Response.json({ ok: false, error: { code, messageKey, correlationId, ...(fieldErrors ? { fieldErrors } : {}) } }, { status, headers });
    try {
      if (request.method !== options.method) return fail(405, "METHOD_NOT_ALLOWED", "api.methodNotAllowed");
      const identity = await options.dependencies.authenticate(request);
      const parsedScope = scopeSchema.safeParse(identity);
      if (!parsedScope.success) return fail(401, "UNAUTHENTICATED", "api.unauthenticated");
      const scope = Object.freeze(parsedScope.data);
      if (!await options.dependencies.authorize(scope, options.permission)) return fail(403, "FORBIDDEN", "api.forbidden");
      if (options.method !== "GET" && !await options.dependencies.verifyMutation(request, scope)) {
        return fail(403, "CSRF_REJECTED", "api.forbidden");
      }
      const parsed = await options.input.safeParseAsync(await options.readInput(request, context));
      if (!parsed.success) {
        const fieldErrors: Record<string, string[]> = Object.create(null);
        for (const issue of parsed.error.issues) {
          const path = issue.path.join(".") || "_form";
          (fieldErrors[path] ??= []).push("validation.invalid");
        }
        return fail(400, "VALIDATION_ERROR", "api.validation", fieldErrors);
      }
      const output = await options.output.parseAsync(await options.run(parsed.data, scope));
      return Response.json({ ok: true, data: output }, { status: options.successStatus ?? 200, headers });
    } catch (error) {
      if (error instanceof ApplicationError) {
        const failure = applicationFailures[error.code];
        return fail(failure.status, error.code, failure.messageKey);
      }
      if (error instanceof ApiHttpError) return fail(error.status, error.code, error.messageKey);
      // Neither provider errors nor Zod output issues may expose internal values.
      console.error({ code: "INTERNAL_ERROR", correlationId });
      return fail(500, "INTERNAL_ERROR", "api.internal");
    }
  };
}

export async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new ApiHttpError(415, "UNSUPPORTED_MEDIA_TYPE", "api.jsonRequired");
  }
  try { return await request.json(); }
  catch { throw new ApiHttpError(400, "INVALID_JSON", "api.invalidJson"); }
}

export function readQuery(request: Request): Record<string, string> {
  const values: Record<string, string> = Object.create(null);
  for (const [key, value] of new URL(request.url).searchParams) {
    if (Object.hasOwn(values, key)) throw new ApiHttpError(400, "DUPLICATE_QUERY", "api.validation");
    values[key] = value;
  }
  return values;
}

export function assertEmptyQuery(request: Request) {
  if (!empty.safeParse(readQuery(request)).success) throw new ApiHttpError(400, "INVALID_QUERY", "api.validation");
}
