import { beforeEach, describe, expect, it, vi } from "vitest";
import { readNotification } from "./read-notification";

describe("readNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("number 타입 notificationId로 읽음 처리 API를 호출한다", async () => {
    const read = vi.fn().mockResolvedValue({ success: true });
    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        read,
      },
    });

    const result = await readNotification({ notificationId: 1 }, { getAuthApi });

    expect(getAuthApi).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true });
  });

  it("string 타입 notificationId를 number로 변환해 읽음 처리 API를 호출한다", async () => {
    const read = vi.fn().mockResolvedValue({ success: true });
    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        read,
      },
    });

    const result = await readNotification({ notificationId: "123" }, { getAuthApi });

    expect(read).toHaveBeenCalledWith(123);
    expect(result).toEqual({ success: true });
  });

  it("양의 정수가 아닌 notificationId면 에러를 던진다", async () => {
    const read = vi.fn();
    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        read,
      },
    });

    await expect(readNotification({ notificationId: 0 }, { getAuthApi })).rejects.toThrow("Invalid notificationId");

    expect(read).not.toHaveBeenCalled();
  });

  it("숫자로 변환할 수 없는 string notificationId면 에러를 던진다", async () => {
    const read = vi.fn();
    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        read,
      },
    });

    await expect(readNotification({ notificationId: "abc" }, { getAuthApi })).rejects.toThrow("Invalid notificationId");

    expect(read).not.toHaveBeenCalled();
  });

  it("소수 형태의 notificationId면 에러를 던진다", async () => {
    const read = vi.fn();
    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        read,
      },
    });

    await expect(readNotification({ notificationId: 1.5 }, { getAuthApi })).rejects.toThrow("Invalid notificationId");

    expect(read).not.toHaveBeenCalled();
  });
});
