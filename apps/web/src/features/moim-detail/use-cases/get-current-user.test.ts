import { describe, expect, it, vi } from "vitest";
import { getCurrentUser } from "./get-current-user";

describe("getCurrentUser", () => {
  it("정상적으로 사용자 정보를 반환한다", async () => {
    const mockGetUser = vi.fn().mockResolvedValue({
      id: 1,
      name: "모음집",
      image: "profile.png",
    });

    const result = await getCurrentUser({
      getUser: mockGetUser,
    });

    expect(mockGetUser).toHaveBeenCalledOnce();
    expect(result).toEqual({
      id: 1,
      name: "모음집",
      image: "profile.png",
    });
  });

  it("값이 undefined일 경우 null로 변환한다", async () => {
    const mockGetUser = vi.fn().mockResolvedValue({
      id: undefined,
      name: undefined,
      image: undefined,
    });

    const result = await getCurrentUser({
      getUser: mockGetUser,
    });

    expect(result).toEqual({
      id: null,
      name: null,
      image: null,
    });
  });

  it("일부 값만 있을 경우 나머지는 null로 채운다", async () => {
    const mockGetUser = vi.fn().mockResolvedValue({
      id: 1,
    });

    const result = await getCurrentUser({
      getUser: mockGetUser,
    });

    expect(result).toEqual({
      id: 1,
      name: null,
      image: null,
    });
  });

  it("getUser에서 에러가 발생하면 그대로 throw 한다", async () => {
    const mockGetUser = vi.fn().mockRejectedValue(new Error("API ERROR"));

    await expect(
      getCurrentUser({
        getUser: mockGetUser,
      }),
    ).rejects.toThrow("API ERROR");
  });
});
