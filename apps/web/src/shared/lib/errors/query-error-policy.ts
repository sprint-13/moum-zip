import { ERROR_CODES, type ErrorCode } from "@/shared/lib/error";
import { isAppError } from "./is-app-error";

const NON_RETRYABLE_ERROR_CODES: Set<ErrorCode> = new Set([
  ERROR_CODES.ALREADY_ATTENDED,
  ERROR_CODES.COMMENT_NOT_FOUND,
  ERROR_CODES.FORBIDDEN,
  ERROR_CODES.INVALID_REQUEST,
  ERROR_CODES.NOT_FOUND,
  ERROR_CODES.POST_NOT_FOUND,
  ERROR_CODES.SCHEDULE_NOT_FOUND,
  ERROR_CODES.SPACE_ACCESS_DENIED,
  ERROR_CODES.SPACE_NOT_FOUND,
  ERROR_CODES.UNAUTHENTICATED,
  ERROR_CODES.UNAUTHORIZED,
  ERROR_CODES.VALIDATION_ERROR,
]);

const RETRYABLE_ERROR_CODES: Set<ErrorCode> = new Set([
  ERROR_CODES.INTERNAL_SERVER_ERROR,
  ERROR_CODES.NETWORK_ERROR,
  ERROR_CODES.REQUEST_FAILED,
]);

export const shouldRetryQueryError = (failureCount: number, error: unknown) => {
  if (failureCount >= 2) {
    return false;
  }

  if (isAppError(error)) {
    if (NON_RETRYABLE_ERROR_CODES.has(error.code)) {
      return false;
    }

    if (RETRYABLE_ERROR_CODES.has(error.code)) {
      return true;
    }

    return error.category === "api";
  }

  return error instanceof Error;
};
