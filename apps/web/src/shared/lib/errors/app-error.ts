import type { ErrorCode } from "./error-codes";

export type AppErrorCategory = "api" | "auth" | "domain" | "not-found" | "validation";

interface AppErrorOptions {
  cause?: unknown;
  category?: AppErrorCategory;
  details?: unknown;
  field?: string;
  message?: string;
  shouldReport?: boolean;
  status?: number;
}

const isAppErrorOptions = (value: unknown): value is AppErrorOptions => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "cause" in value ||
    "category" in value ||
    "details" in value ||
    "field" in value ||
    "message" in value ||
    "shouldReport" in value ||
    "status" in value
  );
};

const toAppErrorOptions = (optionsOrCause?: AppErrorOptions | unknown): AppErrorOptions => {
  if (isAppErrorOptions(optionsOrCause)) {
    return optionsOrCause;
  }

  if (typeof optionsOrCause === "undefined") {
    return {};
  }

  return {
    cause: optionsOrCause,
  };
};

export class AppError extends Error {
  public readonly category: AppErrorCategory;
  public readonly code: ErrorCode;
  public readonly details?: unknown;
  public readonly field?: string;
  public readonly shouldReport: boolean;
  public readonly status?: number;

  constructor(code: ErrorCode, optionsOrCause?: AppErrorOptions | unknown) {
    const options = toAppErrorOptions(optionsOrCause);

    super(options.message ?? code, { cause: options.cause });

    this.name = "AppError";
    this.category = options.category ?? "domain";
    this.code = code;
    this.details = options.details;
    this.field = options.field;
    this.shouldReport = options.shouldReport ?? false;
    this.status = options.status;
  }
}

export class ApiError extends AppError {
  constructor(code: ErrorCode, optionsOrCause?: AppErrorOptions | unknown) {
    const options = toAppErrorOptions(optionsOrCause);

    super(code, {
      ...options,
      category: options.category ?? "api",
      shouldReport: options.shouldReport ?? true,
    });

    this.name = "ApiError";
  }
}

export class AuthError extends ApiError {
  constructor(code: ErrorCode, optionsOrCause?: AppErrorOptions | unknown) {
    const options = toAppErrorOptions(optionsOrCause);

    super(code, {
      ...options,
      category: "auth",
      shouldReport: options.shouldReport ?? false,
    });

    this.name = "AuthError";
  }
}

export class DomainError extends AppError {
  constructor(code: ErrorCode, optionsOrCause?: AppErrorOptions | unknown) {
    const options = toAppErrorOptions(optionsOrCause);

    super(code, {
      ...options,
      category: "domain",
      shouldReport: options.shouldReport ?? false,
    });

    this.name = "DomainError";
  }
}

export class ValidationError extends AppError {
  constructor(code: ErrorCode, optionsOrCause?: AppErrorOptions | unknown) {
    const options = toAppErrorOptions(optionsOrCause);

    super(code, {
      ...options,
      category: "validation",
      shouldReport: options.shouldReport ?? false,
    });

    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(code: ErrorCode, optionsOrCause?: AppErrorOptions | unknown) {
    const options = toAppErrorOptions(optionsOrCause);

    super(code, {
      ...options,
      category: "not-found",
      shouldReport: options.shouldReport ?? false,
    });

    this.name = "NotFoundError";
  }
}
