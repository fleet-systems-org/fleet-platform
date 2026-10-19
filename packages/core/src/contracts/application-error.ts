export type ApplicationErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "UNAUTHENTICATED"
  | "CONFLICT"
  | "VALIDATION_ERROR";

// Use cases describe failures without depending on HTTP or exposing private text.
export class ApplicationError extends Error {
  constructor(public readonly code: ApplicationErrorCode) {
    super(code);
    this.name = "ApplicationError";
  }
}
