import { ApiError, AuthError } from "./app-error";
import { ERROR_CODES, type ErrorCode } from "./error-codes";
import { isAppError } from "./is-app-error";

export interface NormalizeApiErrorOptions {
  code?: ErrorCode;
  fallbackMessage?: string;
  shouldReport?: boolean;
}

interface ParsedResponseError {
  code?: string;
  details?: unknown;
  message?: string;
}

const DEFAULT_ERROR_MESSAGE = "요청 처리 중 오류가 발생했습니다.";

const getDefaultShouldReport = (status: number | undefined, code: ErrorCode) => {
  if (typeof status === "number") {
    return status >= 500;
  }

  return (
    code === ERROR_CODES.INTERNAL_SERVER_ERROR ||
    code === ERROR_CODES.NETWORK_ERROR ||
    code === ERROR_CODES.REQUEST_FAILED
  );
};

const getStatusFromMessage = (message?: string): number | undefined => {
  if (typeof message !== "string") {
    return undefined;
  }

  if (/\b401\b/.test(message)) {
    return 401;
  }

  if (/\b403\b/.test(message)) {
    return 403;
  }

  if (/\b404\b/.test(message)) {
    return 404;
  }

  return undefined;
};

const getCodeByStatus = (status?: number): ErrorCode => {
  switch (status) {
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    default:
      if (typeof status === "number" && status >= 500) {
        return ERROR_CODES.INTERNAL_SERVER_ERROR;
      }

      return ERROR_CODES.REQUEST_FAILED;
  }
};

const parseResponseError = async (response: Response): Promise<ParsedResponseError> => {
  try {
    const data = await response.clone().json();

    if (typeof data === "object" && data !== null) {
      return {
        code: "code" in data && typeof data.code === "string" ? data.code : undefined,
        details: data,
        message:
          "message" in data && typeof data.message === "string"
            ? data.message
            : "error" in data && typeof data.error === "string"
              ? data.error
              : undefined,
      };
    }
  } catch {}

  try {
    const text = await response.clone().text();

    if (text) {
      return {
        details: text,
        message: text,
      };
    }
  } catch {}

  return {};
};

const buildApiError = (
  code: ErrorCode,
  message: string,
  status: number | undefined,
  details: unknown,
  cause: unknown,
  shouldReport: boolean,
) => {
  if (status === 401 || status === 403) {
    return new AuthError(code, {
      cause,
      details,
      message,
      shouldReport,
      status,
    });
  }

  return new ApiError(code, {
    cause,
    details,
    message,
    shouldReport,
    status,
  });
};

export const normalizeApiError = async (error: unknown, options: NormalizeApiErrorOptions = {}) => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Response) {
    const parsedError = await parseResponseError(error);
    const code = options.code ?? (parsedError.code as ErrorCode | undefined) ?? getCodeByStatus(error.status);
    const message = parsedError.message ?? options.fallbackMessage ?? `${error.status} ${error.statusText}`;

    return buildApiError(
      code,
      message,
      error.status,
      parsedError.details ?? parsedError,
      error,
      options.shouldReport ?? getDefaultShouldReport(error.status, code),
    );
  }

  if (error instanceof Error) {
    const inferredStatus = getStatusFromMessage(error.message);
    const code =
      error.name === "TypeError"
        ? ERROR_CODES.NETWORK_ERROR
        : (options.code ?? getCodeByStatus(inferredStatus) ?? ERROR_CODES.REQUEST_FAILED);

    return buildApiError(
      code,
      error.message || options.fallbackMessage || DEFAULT_ERROR_MESSAGE,
      inferredStatus,
      undefined,
      error,
      options.shouldReport ?? getDefaultShouldReport(inferredStatus, code),
    );
  }

  if (typeof error === "object" && error !== null) {
    const message =
      ("message" in error && typeof error.message === "string"
        ? error.message
        : "error" in error && typeof error.error === "string"
          ? error.error
          : undefined) ??
      options.fallbackMessage ??
      DEFAULT_ERROR_MESSAGE;
    const status =
      ("status" in error && typeof error.status === "number" ? error.status : undefined) ??
      getStatusFromMessage(message);
    const code =
      options.code ??
      ("code" in error && typeof error.code === "string" ? (error.code as ErrorCode) : getCodeByStatus(status));

    return buildApiError(
      code,
      message,
      status,
      error,
      error,
      options.shouldReport ?? getDefaultShouldReport(status, code),
    );
  }

  return buildApiError(
    options.code ?? ERROR_CODES.REQUEST_FAILED,
    options.fallbackMessage ?? DEFAULT_ERROR_MESSAGE,
    undefined,
    undefined,
    error,
    options.shouldReport ?? getDefaultShouldReport(undefined, options.code ?? ERROR_CODES.REQUEST_FAILED),
  );
};

export const throwIfNotOk = async (response: Response, options: NormalizeApiErrorOptions = {}) => {
  if (!response.ok) {
    throw await normalizeApiError(response, options);
  }

  return response;
};
