"use client";

import { Bell } from "@moum-zip/ui/icons";
import { Dropdown, Sheet, toast } from "@ui/components";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { getNotificationHref } from "@/entities/notification/model/constants";
import type { NotificationItem } from "@/entities/notification/model/types";
import type { NotificationActionResult } from "@/features/notification/actions";
import {
  deleteAllNotificationsAction,
  deleteAllSpaceNotificationsAction,
  getNotificationsAction,
  readAllNotificationsAction,
  readAllSpaceNotificationsAction,
  readNotificationAction,
  readSpaceNotificationAction,
} from "@/features/notification/actions";
import { NotificationPanel } from "./notification-panel";

interface NotificationMenuProps {
  notifications: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
  desktopSide?: "bottom" | "right";
  mobileVariant?: "sheet" | "dropdown";
}

function getActionErrorMessage(
  externalResult: NotificationActionResult,
  internalResult: NotificationActionResult,
  fallbackMessage: string,
) {
  if (!externalResult.ok) {
    return externalResult.message;
  }

  if (!internalResult.ok) {
    return internalResult.message;
  }

  return fallbackMessage;
}

export function NotificationMenu({
  notifications,
  nextCursor: initialNextCursor,
  hasMore: initialHasMore,
  desktopSide = "bottom",
  mobileVariant = "sheet",
}: NotificationMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>(notifications);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const prevIsDesktopRef = useRef<boolean | null>(null);

  useEffect(() => {
    setLocalNotifications(notifications);
    setNextCursor(initialNextCursor);
    setHasMore(initialHasMore);
  }, [notifications, initialNextCursor, initialHasMore]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const applyMode = (matches: boolean) => {
      const prev = prevIsDesktopRef.current;
      const modeChanged = prev !== null && prev !== matches;

      prevIsDesktopRef.current = matches;
      setIsDesktop(matches);

      if (modeChanged && open) {
        setOpen(false);

        // Dropdown <-> Sheet / 방향 전환 시 Radix 레이어가 이전 DOM 상태를 참조하는 경우가 있어
        // 한 프레임 닫고 다음 프레임에 다시 열어 레이어 위치를 안정적으로 재계산합니다.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOpen(true);
          });
        });
      }
    };

    applyMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyMode(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [open]);

  const unreadCount = localNotifications.filter((item) => !item.isRead).length;

  const handleLoadMore = async () => {
    if (!open || !hasMore || !nextCursor || isFetchingMore || isPending) {
      return;
    }

    setIsFetchingMore(true);

    try {
      const result = await getNotificationsAction({
        cursor: nextCursor,
        size: 10,
      });

      if (!result.ok) {
        toast({ message: result.message });
        return;
      }

      setLocalNotifications((prev) => {
        const existingKeys = new Set(prev.map((item) => `${item.source}-${item.id}`));
        const appended = result.data.filter((item) => !existingKeys.has(`${item.source}-${item.id}`));

        return [...prev, ...appended];
      });

      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch {
      toast({ message: "알림을 불러오지 못했어요" });
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleReadAll = () => {
    if (unreadCount === 0 || isPending || isFetchingMore) {
      return;
    }

    setLocalNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

    startTransition(async () => {
      try {
        const [externalResult, internalResult] = await Promise.all([
          readAllNotificationsAction(),
          readAllSpaceNotificationsAction(),
        ]);

        if (!externalResult.ok || !internalResult.ok) {
          toast({
            message: getActionErrorMessage(externalResult, internalResult, "알림 읽기 처리에 실패했어요"),
          });
          router.refresh();
        }
      } catch {
        toast({ message: "알림 읽기 처리에 실패했어요" });
        router.refresh();
      }
    });
  };

  const handleDeleteAll = () => {
    if (localNotifications.length === 0 || isPending || isFetchingMore) {
      return;
    }

    setIsDeleteConfirming(true);
  };

  const handleCancelDeleteAll = () => {
    if (isPending) {
      return;
    }

    setIsDeleteConfirming(false);
  };

  const handleConfirmDeleteAll = () => {
    if (localNotifications.length === 0 || isPending || isFetchingMore) {
      return;
    }

    setIsDeleteConfirming(false);
    setLocalNotifications([]);
    setNextCursor(null);
    setHasMore(false);

    startTransition(async () => {
      try {
        const [externalResult, internalResult] = await Promise.all([
          deleteAllNotificationsAction(),
          deleteAllSpaceNotificationsAction(),
        ]);

        if (!externalResult.ok || !internalResult.ok) {
          toast({
            message: getActionErrorMessage(externalResult, internalResult, "알림 삭제에 실패했어요"),
          });
          router.refresh();
        }
      } catch {
        toast({ message: "알림 삭제에 실패했어요" });
        router.refresh();
      }
    });
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (isPending) {
      return;
    }

    const href = getNotificationHref(notification);
    const previous = localNotifications;

    if (!notification.isRead) {
      setLocalNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id && item.source === notification.source ? { ...item, isRead: true } : item,
        ),
      );
    }

    startTransition(async () => {
      try {
        if (!notification.isRead) {
          if (notification.source === "external" && typeof notification.id === "number") {
            const result = await readNotificationAction({
              notificationId: notification.id,
            });

            if (!result.ok) {
              throw new Error(result.message);
            }
          }

          if (notification.source === "internal") {
            const result = await readSpaceNotificationAction({
              notificationId: notification.id,
            });

            if (!result.ok) {
              throw new Error(result.message);
            }
          }
          if (!href) {
            router.refresh();
          }
        }

        setOpen(false);
        setIsDeleteConfirming(false);

        if (href) {
          router.push(href);
        }
      } catch (error) {
        toast({
          message: error instanceof Error ? error.message : "알림 처리 중 오류가 발생했어요",
        });

        if (!notification.isRead) {
          setLocalNotifications(previous);
        }
      }
    });
  };

  const triggerButton = (
    <button
      type="button"
      aria-label="알림 열기"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
    >
      <Bell className="h-5 w-5 text-slate-500" />
      {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />}
    </button>
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setIsDeleteConfirming(false);
    }
  };

  if (isDesktop) {
    return (
      <Dropdown open={open} onOpenChange={handleOpenChange} modal={false}>
        <Dropdown.Trigger asChild>{triggerButton}</Dropdown.Trigger>

        <Dropdown.Content
          side={desktopSide}
          align={desktopSide === "right" ? "start" : "end"}
          sideOffset={16}
          className="w-[20rem] rounded-[24px] bg-white p-0 shadow-lg"
        >
          <NotificationPanel
            notifications={localNotifications}
            isDeleteConfirming={isDeleteConfirming}
            onReadAll={handleReadAll}
            onDeleteAll={handleDeleteAll}
            onCancelDeleteAll={handleCancelDeleteAll}
            onConfirmDeleteAll={handleConfirmDeleteAll}
            onItemClick={handleNotificationClick}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
          />
        </Dropdown.Content>
      </Dropdown>
    );
  }

  if (mobileVariant === "dropdown") {
    return (
      <Dropdown open={open} onOpenChange={handleOpenChange} modal={false}>
        <Dropdown.Trigger asChild>{triggerButton}</Dropdown.Trigger>

        <Dropdown.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className="w-[min(calc(100vw-1rem),20rem)] rounded-[24px] bg-white p-0 shadow-lg"
        >
          <NotificationPanel
            notifications={localNotifications}
            isDeleteConfirming={isDeleteConfirming}
            onReadAll={handleReadAll}
            onDeleteAll={handleDeleteAll}
            onCancelDeleteAll={handleCancelDeleteAll}
            onConfirmDeleteAll={handleConfirmDeleteAll}
            onItemClick={handleNotificationClick}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
          />
        </Dropdown.Content>
      </Dropdown>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Sheet.Trigger asChild>{triggerButton}</Sheet.Trigger>

      <Sheet.Content side="right" className="h-dvh w-[min(100vw,20rem)] border-none p-0">
        <NotificationPanel
          notifications={localNotifications}
          isMobile
          isDeleteConfirming={isDeleteConfirming}
          onReadAll={handleReadAll}
          onDeleteAll={handleDeleteAll}
          onCancelDeleteAll={handleCancelDeleteAll}
          onConfirmDeleteAll={handleConfirmDeleteAll}
          onItemClick={handleNotificationClick}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
        />
      </Sheet.Content>
    </Sheet>
  );
}
