export type ApiFailure = { code: string; messageKey: string; fieldErrors?: Record<string, string[]>; correlationId?: string };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiFailure };
export type ResultParser<T> = { safeParse: (value: unknown) => { success: true; data: ApiResult<T> } | { success: false } };

export class ApiCallError extends Error {
  constructor(public readonly detail: ApiFailure) { super(detail.code); }
}

export async function apiCall<T>(path: string, options: {
  parser: ResultParser<T>;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  csrfToken?: string;
  signal?: AbortSignal;
}): Promise<ApiResult<T>> {
  const failure = (code: string, messageKey: string): ApiResult<T> => ({ ok: false, error: { code, messageKey } });
  // Same-origin paths only; prevent credentials being sent through arbitrary URLs.
  let url: URL;
  try { url = new URL(path, "https://local.invalid"); }
  catch { return failure("INVALID_PATH", "api.invalidPath"); }
  if (!path.startsWith("/api/") || /[\\\r\n]/.test(path) || url.origin !== "https://local.invalid" || !url.pathname.startsWith("/api/")) {
    return failure("INVALID_PATH", "api.invalidPath");
  }
  try {
    const headers = new Headers({ Accept: "application/json" });
    if (options.body !== undefined) headers.set("Content-Type", "application/json");
    if (options.csrfToken) headers.set("X-CSRF-Token", options.csrfToken);
    const response = await fetch(path, {
      method: options.method ?? "GET", credentials: "same-origin", redirect: "error", cache: "no-store",
      headers, signal: options.signal, ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
    let value: unknown;
    try { value = await response.json(); }
    catch (error) {
      if (options.signal?.aborted || (error instanceof Error && error.name === "AbortError")) return failure("ABORTED", "api.aborted");
      return failure("PROTOCOL_ERROR", "api.protocol");
    }
    let result: ReturnType<ResultParser<T>["safeParse"]>;
    try { result = options.parser.safeParse(value); }
    catch { return failure("PROTOCOL_ERROR", "api.protocol"); }
    if (!result.success || (response.ok !== result.data.ok)) return failure("PROTOCOL_ERROR", "api.protocol");
    return result.data;
  } catch (error) {
    if (options.signal?.aborted || (error instanceof Error && error.name === "AbortError")) return failure("ABORTED", "api.aborted");
    return failure("NETWORK_ERROR", "api.network");
  }
}

export async function apiCallOrThrow<T>(path: string, options: Parameters<typeof apiCall<T>>[1]): Promise<T> {
  const result = await apiCall(path, options);
  if (!result.ok) throw new ApiCallError(result.error);
  return result.data;
}
