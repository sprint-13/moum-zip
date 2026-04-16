import { describe, expect, it } from "vitest";
import { ApiError, DomainError, ValidationError } from "@/shared/lib/error";
import { ERROR_CODES } from "./error-codes";
import { shouldRetryQueryError } from "./query-error-policy";

describe("shouldRetryQueryError", () => {
  it("네트워크 계열 ApiError는 한 번 재시도한다", () => {
    const error = new ApiError(ERROR_CODES.NETWORK_ERROR, {
      message: "네트워크 오류",
    });

    expect(shouldRetryQueryError(1, error)).toBe(true);
    expect(shouldRetryQueryError(2, error)).toBe(false);
  });

  it("검증 에러는 재시도하지 않는다", () => {
    const error = new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: "입력값이 올바르지 않습니다.",
    });

    expect(shouldRetryQueryError(1, error)).toBe(false);
  });

  it("도메인 에러는 재시도하지 않는다", () => {
    const error = new DomainError(ERROR_CODES.INVALID_REQUEST, {
      message: "유효하지 않은 요청입니다.",
    });

    expect(shouldRetryQueryError(1, error)).toBe(false);
  });
});
