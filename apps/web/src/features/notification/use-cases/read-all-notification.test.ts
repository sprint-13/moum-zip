import { beforeEach, describe, expect, it, vi } from "vitest";
import { readAllNotifications } from "./read-all-notification";

describe("readAllNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("전체 알림 읽음 처리 API를 호출한다", async () => {
    const readAll = vi.fn().mockResolvedValue({ success: true });
    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        readAll,
      },
    });

    const result = await readAllNotifications(undefined, { getAuthApi });

    expect(getAuthApi).toHaveBeenCalledTimes(1);
    expect(readAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });
});
