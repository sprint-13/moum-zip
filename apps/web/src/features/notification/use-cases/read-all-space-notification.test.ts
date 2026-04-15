import { beforeEach, describe, expect, it, vi } from "vitest";
import { notifications } from "@/shared/db/scheme";
import { readAllSpaceNotifications } from "./read-all-space-notification";

describe("readAllSpaceNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("해당 사용자의 읽지 않은 스페이스 알림을 모두 읽음 처리한다", async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    const set = vi.fn(() => ({ where }));
    const update = vi.fn(() => ({ set }));

    const database = {
      update,
    } as never;

    const result = await readAllSpaceNotifications({ userId: 1 }, { database });

    expect(update).toHaveBeenCalledWith(notifications);
    expect(set).toHaveBeenCalledWith({ isRead: true });
    expect(where).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true });
  });
});
