import { describe, expect, it } from "vitest";
import { AuthError } from "./app-error";
import { getErrorPresentation } from "./get-error-presentation";
import { normalizeApiError } from "./normalize-api-error";

describe("normalizeApiError", () => {
  it("401 응답은 AuthError로 정규화한다", async () => {
    const response = new Response(JSON.stringify({ message: "로그인이 필요합니다." }), {
      status: 401,
      statusText: "Unauthorized",
    });

    const error = await normalizeApiError(response);

    expect(error).toBeInstanceOf(AuthError);
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("로그인이 필요합니다.");
  });

  it("일반 Error는 ApiError로 정규화한다", async () => {
    const error = await normalizeApiError(new Error("네트워크 오류"));

    expect(error.name).toBe("ApiError");
    expect(error.code).toBe("REQUEST_FAILED");
    expect(error.message).toBe("네트워크 오류");
  });
});

describe("getErrorPresentation", () => {
  it("404 에러 코드는 boundary로 매핑한다", async () => {
    const error = await normalizeApiError(
      new Response(JSON.stringify({ message: "게시글을 찾을 수 없습니다." }), {
        status: 404,
        statusText: "Not Found",
      }),
    );

    expect(getErrorPresentation(error)).toEqual({
      message: "게시글을 찾을 수 없습니다.",
      retryable: false,
      shouldReport: false,
      type: "boundary",
    });
  });
});
