import { isAppError } from "./is-app-error";
import { type NormalizeApiErrorOptions, normalizeApiError } from "./normalize-api-error";

interface ReportErrorOptions extends NormalizeApiErrorOptions {
  extras?: Record<string, unknown>;
  tags?: Record<string, string>;
}

export const reportError = async (error: unknown, options: ReportErrorOptions = {}) => {
  const normalizedError = isAppError(error) ? error : await normalizeApiError(error, options);

  if (!normalizedError.shouldReport) {
    return normalizedError;
  }

  try {
    const Sentry = await import("@sentry/nextjs");

    Sentry.withScope((scope) => {
      scope.setTag("error.category", normalizedError.category);
      scope.setTag("error.code", normalizedError.code);

      if (typeof normalizedError.status === "number") {
        scope.setTag("error.status", String(normalizedError.status));
      }

      if (typeof normalizedError.field === "string") {
        scope.setExtra("field", normalizedError.field);
      }

      if (typeof normalizedError.details !== "undefined") {
        scope.setExtra("details", normalizedError.details);
      }

      Object.entries(options.tags ?? {}).forEach(([key, value]) => {
        scope.setTag(key, value);
      });

      Object.entries(options.extras ?? {}).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });

      Sentry.captureException(normalizedError);
    });
  } catch {}

  return normalizedError;
};
