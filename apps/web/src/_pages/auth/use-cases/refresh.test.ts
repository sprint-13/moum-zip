import { describe, expect, it, vi } from "vitest";
import { refresh } from "./refresh";

const FAKE_ACCESS_TOKEN = [
  "header",
  btoa(JSON.stringify({ sub: "1", exp: Math.floor(Date.now() / 1000) + 3600, iat: 0 })),
  "signature",
].join(".");

const FAKE_REFRESH_TOKEN = "fake-refresh-token";

describe("refresh", () => {
  it("토큰 갱신 성공 시 ok: true와 data를 반환한다", async () => {
    const mockAuthApi = {
      refresh: vi.fn().mockResolvedValue({
        data: {
          accessToken: FAKE_ACCESS_TOKEN,
          refreshToken: FAKE_REFRESH_TOKEN,
        },
      }),
    };

    const result = await refresh({ refreshToken: FAKE_REFRESH_TOKEN }, { authApi: mockAuthApi });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.accessToken).toBe(FAKE_ACCESS_TOKEN);
    }
  });

  it("401 에러 시 INVALID_TOKEN을 반환한다", async () => {
    const mockAuthApi = {
      refresh: vi.fn().mockRejectedValue({ status: 401 }),
    };

    const result = await refresh({ refreshToken: "expired-refresh-token" }, { authApi: mockAuthApi });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("INVALID_TOKEN");
    }
  });

  it("네트워크 오류 시 SERVER_ERROR를 반환한다", async () => {
    const mockAuthApi = {
      refresh: vi.fn().mockRejectedValue(new Error("Network Error")),
    };

    const result = await refresh({ refreshToken: FAKE_REFRESH_TOKEN }, { authApi: mockAuthApi });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("SERVER_ERROR");
    }
  });
});
