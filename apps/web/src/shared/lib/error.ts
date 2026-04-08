const ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  SPACE_NOT_FOUND: "SPACE_NOT_FOUND",
  SPACE_ACCESS_DENIED: "SPACE_ACCESS_DENIED",
  POST_NOT_FOUND: "POST_NOT_FOUND",
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    cause?: unknown,
  ) {
    super(code);
    this.name = "AppError";
    if (cause) this.cause = cause;
  }
}
