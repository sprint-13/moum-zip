import { describe, expect, it, vi } from "vitest";
import { loginRemote } from "./login";

// 테스트용 토큰 (만료 시각을 미래로 설정, isValid()가 true 반환하도록)
const FAKE_ACCESS_TOKEN = [
  "header",
  btoa(JSON.stringify({ sub: "1", exp: Math.floor(Date.now() / 1000) + 3600, iat: 0 })),
  "signature",
].join(".");

const FAKE_REFRESH_TOKEN = "fake-refresh-token";

// 테스트용 백엔드 응답
const MOCK_LOGIN_RESPONSE = {
  data: {
    user: {
      id: 1,
      teamId: "dallaem",
      email: "test@test.com",
      name: "홍길동",
      companyName: "코드잇",
      image: null,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
    accessToken: FAKE_ACCESS_TOKEN,
    refreshToken: FAKE_REFRESH_TOKEN,
  },
};

describe("loginRemote", () => {
  it("로그인 성공 시 ok: true와 data를 반환한다", async () => {
    // 테스트용 api
    const mockAuthApi = {
      login: vi.fn().mockResolvedValue(MOCK_LOGIN_RESPONSE),
    };

    const result = await loginRemote({ email: "test@test.com", password: "password123" }, { authApi: mockAuthApi });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.accessToken).toBe(FAKE_ACCESS_TOKEN);
    }
  });

  it("401 에러 시 INVALID_CREDENTIALS를 반환한다", async () => {
    const mockAuthApi = {
      login: vi.fn().mockRejectedValue(new Error("401 Unauthorized")),
    };

    const result = await loginRemote({ email: "wrong@test.com", password: "wrongpassword" }, { authApi: mockAuthApi });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("INVALID_CREDENTIALS");
    }
  });

  it("네트워크 오류 시 SERVER_ERROR를 반환한다", async () => {
    const mockAuthApi = {
      login: vi.fn().mockRejectedValue(new Error("Network Error")),
    };

    const result = await loginRemote({ email: "test@test.com", password: "password123" }, { authApi: mockAuthApi });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("SERVER_ERROR");
    }
  });
});
