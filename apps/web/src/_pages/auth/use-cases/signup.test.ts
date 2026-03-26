import { describe, expect, it, vi } from "vitest";
import { signup } from "./signup";

const MOCK_USER = {
  id: 1,
  teamId: "dallaem",
  email: "test@test.com",
  name: "홍길동",
  companyName: "코드잇",
  image: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("signup", () => {
  it("회원가입 성공 시 ok: true와 data를 반환한다", async () => {
    const mockAuthApi = {
      signup: vi.fn().mockResolvedValue({ data: MOCK_USER }),
    };

    const result = await signup(
      { email: "test@test.com", password: "password123", name: "홍길동" },
      { authApi: mockAuthApi },
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe("test@test.com");
    }
  });

  it("409 에러 시 EMAIL_ALREADY_EXISTS를 반환한다", async () => {
    const mockAuthApi = {
      signup: vi.fn().mockRejectedValue(new Error("409 Conflict")),
    };

    const result = await signup(
      { email: "test@test.com", password: "password123", name: "홍길동" },
      { authApi: mockAuthApi },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("EMAIL_ALREADY_EXISTS");
    }
  });

  it("네트워크 오류 시 SERVER_ERROR를 반환한다", async () => {
    const mockAuthApi = {
      signup: vi.fn().mockRejectedValue(new Error("Network Error")),
    };

    const result = await signup(
      { email: "test@test.com", password: "password123", name: "홍길동" },
      { authApi: mockAuthApi },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("SERVER_ERROR");
    }
  });
});
