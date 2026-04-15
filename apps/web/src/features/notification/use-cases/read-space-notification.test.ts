import { beforeEach, describe, expect, it, vi } from "vitest";
import { notifications } from "@/shared/db/scheme";
import { readSpaceNotification } from "./read-space-notification";

describe("readSpaceNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("해당 알림을 읽음 처리한다", async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    const set = vi.fn(() => ({ where }));
    const update = vi.fn(() => ({ set }));

    const database = {
      update,
    } as never;

    const result = await readSpaceNotification(
      {
        notificationId: "noti-1",
        userId: 1,
      },
      { database },
    );

    expect(update).toHaveBeenCalledWith(notifications);
    expect(set).toHaveBeenCalledWith({ isRead: true });
    expect(where).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ success: true });
  });

  it("notificationId가 number여도 string으로 변환되어 처리된다", async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    const set = vi.fn(() => ({ where }));
    const update = vi.fn(() => ({ set }));

    const database = {
      update,
    } as never;

    await readSpaceNotification(
      {
        notificationId: 123,
        userId: 1,
      },
      { database },
    );

    expect(set).toHaveBeenCalledWith({ isRead: true });
    expect(where).toHaveBeenCalledTimes(1);
  });
});
