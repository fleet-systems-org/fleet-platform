import { z } from "zod";

export const apiErrorSchema = z.object({
  code: z.string(),
  messageKey: z.string(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
  correlationId: z.string().optional(),
});

export function apiResultSchema<T extends z.ZodType>(data: T) {
  return z.discriminatedUnion("ok", [
    z.object({ ok: z.literal(true), data }),
    z.object({ ok: z.literal(false), error: apiErrorSchema }),
  ]);
}

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };
