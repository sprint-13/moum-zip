import { beforeEach, describe, expect, it, vi } from "vitest";
import { notifications } from "@/shared/db/scheme";
import { deleteAllSpaceNotifications } from "./delete-all-space-notification";

describe("deleteAllSpaceNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("해당 userId의 스페이스 알림을 모두 삭제한다", async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    const deleteFn = vi.fn(() => ({ where }));

    const database = {
      delete: deleteFn,
    } as never;

    await deleteAllSpaceNotifications({ userId: 1 }, { database });

    expect(deleteFn).toHaveBeenCalledWith(notifications);
    expect(where).toHaveBeenCalledTimes(1);
  });
});
