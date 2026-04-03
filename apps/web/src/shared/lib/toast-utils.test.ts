import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockDismiss, mockToast } = vi.hoisted(() => {
  return {
    mockDismiss: vi.fn(),
    mockToast: vi.fn(),
  };
});

vi.mock("@ui/components", () => {
  return {
    toast: mockToast,
  };
});

describe("toast-utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.resetModules();

    mockToast.mockReturnValue({
      dismiss: mockDismiss,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("showRequiredToast", () => {
    it("메시지와 고정 옵션으로 토스트를 띄운다", async () => {
      const { showRequiredToast } = await import("./toast-utils");

      showRequiredToast("로그인 후 이용할 수 있어요.");

      expect(mockToast).toHaveBeenCalledWith({
        id: "required-toast",
        message: "로그인 후 이용할 수 있어요.",
        size: "small",
      });
    });

    it("토스트가 떠 있는 동안에는 중복으로 띄우지 않는다", async () => {
      const { showRequiredToast } = await import("./toast-utils");

      showRequiredToast("로그인 후 이용할 수 있어요.");
      showRequiredToast("로그인 후 이용할 수 있어요.");

      expect(mockToast).toHaveBeenCalledTimes(1);
    });

    it("토스트 유지 시간이 지나면 dismiss를 호출한다", async () => {
      const { showRequiredToast } = await import("./toast-utils");

      showRequiredToast("로그인 후 이용할 수 있어요.");

      vi.advanceTimersByTime(1499);
      expect(mockDismiss).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });

    it("lock 시간이 지나면 다시 토스트를 띄울 수 있다", async () => {
      const { showRequiredToast } = await import("./toast-utils");

      showRequiredToast("로그인 후 이용할 수 있어요.");

      vi.advanceTimersByTime(1699);
      showRequiredToast("로그인 후 이용할 수 있어요.");

      expect(mockToast).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      showRequiredToast("로그인 후 이용할 수 있어요.");

      expect(mockToast).toHaveBeenCalledTimes(2);
      expect(mockToast).toHaveBeenNthCalledWith(2, {
        id: "required-toast",
        message: "로그인 후 이용할 수 있어요.",
        size: "small",
      });
    });
  });
});
