import { describe, expect, it, vi } from "vitest";
import { logout } from "./logout";

describe("logout", () => {
  it("로그아웃 성공 시 ok: true를 반환한다", async () => {
    const mockAuthApi = {
      logout: vi.fn().mockResolvedValue(undefined),
    };

    const result = await logout({ refreshToken: "fake-refresh-token" }, { authApi: mockAuthApi });

    expect(result.ok).toBe(true);
  });

  it("네트워크 오류 시 SERVER_ERROR를 반환한다", async () => {
    const mockAuthApi = {
      logout: vi.fn().mockRejectedValue(new Error("Network Error")),
    };

    const result = await logout({ refreshToken: "fake-refresh-token" }, { authApi: mockAuthApi });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("SERVER_ERROR");
    }
  });
});
