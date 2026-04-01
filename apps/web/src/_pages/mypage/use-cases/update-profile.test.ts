import { describe, expect, it, vi } from "vitest";
import { updateProfile } from "./update-profile";

describe("updateProfile", () => {
  it("이름이 유효하면 프로필 수정을 성공 처리한다", async () => {
    const mockUserApi = {
      patchUser: vi.fn().mockResolvedValue({}),
    };

    const result = await updateProfile({ name: "홍길동" }, { userApi: mockUserApi });

    expect(result).toEqual({ ok: true });
    expect(mockUserApi.patchUser).toHaveBeenCalledWith({ name: "홍길동" });
  });

  it("이름이 비어 있으면 EMPTY_NAME을 반환한다", async () => {
    const mockUserApi = {
      patchUser: vi.fn(),
    };

    const result = await updateProfile({ name: "   " }, { userApi: mockUserApi });

    expect(result).toEqual({ ok: false, error: "EMPTY_NAME" });
    expect(mockUserApi.patchUser).not.toHaveBeenCalled();
  });

  it("이름이 20자를 초과하면 NAME_TOO_LONG을 반환한다", async () => {
    const mockUserApi = {
      patchUser: vi.fn(),
    };

    const result = await updateProfile({ name: "가".repeat(21) }, { userApi: mockUserApi });

    expect(result).toEqual({ ok: false, error: "NAME_TOO_LONG" });
    expect(mockUserApi.patchUser).not.toHaveBeenCalled();
  });

  it("401 응답이면 UNAUTHORIZED를 반환한다", async () => {
    const mockUserApi = {
      patchUser: vi.fn().mockRejectedValue(new Error("401 Unauthorized")),
    };

    const result = await updateProfile({ name: "홍길동" }, { userApi: mockUserApi });

    expect(result).toEqual({ ok: false, error: "UNAUTHORIZED" });
  });

  it("기타 오류면 SERVER_ERROR를 반환한다", async () => {
    const mockUserApi = {
      patchUser: vi.fn().mockRejectedValue(new Error("Network Error")),
    };

    const result = await updateProfile({ name: "홍길동" }, { userApi: mockUserApi });

    expect(result).toEqual({ ok: false, error: "SERVER_ERROR" });
  });
});
