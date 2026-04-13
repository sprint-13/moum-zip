import { ValidationError } from "./app-error";
import { ERROR_CODES, type ErrorCode } from "./error-codes";
import { isAppError } from "./is-app-error";

export type ErrorPresentationType = "boundary" | "inline" | "modal" | "toast";

export interface ErrorPresentation {
  message: string;
  retryable: boolean;
  shouldReport: boolean;
  type: ErrorPresentationType;
}

const DEFAULT_ERROR_MESSAGE = "요청 처리 중 오류가 발생했습니다.";

const BOUNDARY_CODES: Set<ErrorCode> = new Set([
  ERROR_CODES.COMMENT_NOT_FOUND,
  ERROR_CODES.NOT_FOUND,
  ERROR_CODES.POST_NOT_FOUND,
  ERROR_CODES.SPACE_ACCESS_DENIED,
  ERROR_CODES.SPACE_NOT_FOUND,
]);

const getDefaultMessage = (message?: string) => {
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return DEFAULT_ERROR_MESSAGE;
};

export const getErrorPresentation = (error: unknown): ErrorPresentation => {
  if (error instanceof ValidationError) {
    return {
      message: getDefaultMessage(error.message),
      retryable: false,
      shouldReport: false,
      type: "inline",
    };
  }

  if (isAppError(error)) {
    if (BOUNDARY_CODES.has(error.code)) {
      return {
        message: getDefaultMessage(error.message),
        retryable: false,
        shouldReport: error.shouldReport,
        type: "boundary",
      };
    }

    if (error.category === "validation") {
      return {
        message: getDefaultMessage(error.message),
        retryable: false,
        shouldReport: false,
        type: "inline",
      };
    }

    if (error.code === ERROR_CODES.NETWORK_ERROR || error.code === ERROR_CODES.INTERNAL_SERVER_ERROR) {
      return {
        message: getDefaultMessage(error.message),
        retryable: true,
        shouldReport: true,
        type: "toast",
      };
    }

    return {
      message: getDefaultMessage(error.message),
      retryable: false,
      shouldReport: error.shouldReport,
      type: "toast",
    };
  }

  if (error instanceof Error) {
    return {
      message: getDefaultMessage(error.message),
      retryable: true,
      shouldReport: true,
      type: "toast",
    };
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
    retryable: true,
    shouldReport: true,
    type: "toast",
  };
};
