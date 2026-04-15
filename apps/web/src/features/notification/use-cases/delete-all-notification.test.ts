import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteAllNotifications } from "./delete-all-notification";

describe("deleteAllNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("전체 알림 삭제 API를 호출한다", async () => {
    const deleteAll = vi.fn().mockResolvedValue(undefined);

    const getAuthApi = vi.fn().mockResolvedValue({
      notifications: {
        deleteAll,
      },
    });

    await deleteAllNotifications({ getAuthApi });

    expect(getAuthApi).toHaveBeenCalledTimes(1);
    expect(deleteAll).toHaveBeenCalledTimes(1);
  });
});
