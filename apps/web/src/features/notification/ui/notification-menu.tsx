"use client";

import { Bell } from "@moum-zip/ui/icons";
import { Dropdown, Sheet } from "@ui/components";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { getNotificationHref } from "@/entities/notification/model/constants";
import type { NotificationItem } from "@/entities/notification/model/types";
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
}

export function NotificationMenu({
  notifications,
  nextCursor: initialNextCursor,
  hasMore: initialHasMore,
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
    if (!open || !hasMore || !nextCursor || isFetchingMore || isPending) return;

    setIsFetchingMore(true);

    try {
      const result = await getNotificationsAction({
        cursor: nextCursor,
        size: 10,
      });

      setLocalNotifications((prev) => {
        const existingKeys = new Set(prev.map((item) => `${item.source}-${item.id}`));

        const appended = result.data.filter((item) => !existingKeys.has(`${item.source}-${item.id}`));

        return [...prev, ...appended];
      });

      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (e) {
      console.error("추가 알림 로딩 실패", e);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleReadAll = () => {
    if (unreadCount === 0 || isPending) return;

    const previous = localNotifications;

    setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    startTransition(async () => {
      try {
        await readAllNotificationsAction();
        await readAllSpaceNotificationsAction();
      } catch (e) {
        console.error("모두 읽기 실패", e);
        setLocalNotifications(previous);
      }
    });
  };

  const handleDeleteAll = () => {
    if (localNotifications.length === 0 || isPending) return;
    setIsDeleteConfirming(true);
  };

  const handleCancelDeleteAll = () => {
    if (isPending) return;
    setIsDeleteConfirming(false);
  };

  const handleConfirmDeleteAll = () => {
    if (localNotifications.length === 0 || isPending) return;

    const previous = localNotifications;

    setIsDeleteConfirming(false);
    setLocalNotifications([]);
    setNextCursor(null);
    setHasMore(false);

    startTransition(async () => {
      try {
        await deleteAllNotificationsAction();
        await deleteAllSpaceNotificationsAction();
      } catch (e) {
        console.error("전체 삭제 실패", e);
        setLocalNotifications(previous);
        setNextCursor(initialNextCursor);
        setHasMore(initialHasMore);
      }
    });
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (isPending) return;

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
            await readNotificationAction({
              notificationId: notification.id,
            });
          }

          if (notification.source === "internal") {
            await readSpaceNotificationAction({
              notificationId: notification.id,
            });
          }

          router.refresh();
        }

        setOpen(false);
        setIsDeleteConfirming(false);

        if (href) {
          router.push(href);
        }
      } catch (e) {
        console.error("알림 클릭 실패", e);

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
      <Bell className="h-6 w-6 text-slate-600" />
      {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />}
    </button>
  );

  if (isDesktop) {
    return (
      <Dropdown
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setIsDeleteConfirming(false);
          }
        }}
        modal={false}
      >
        <Dropdown.Trigger asChild>{triggerButton}</Dropdown.Trigger>

        <Dropdown.Content align="end" sideOffset={10} className="w-[20rem] rounded-[24px] bg-white p-0 shadow-lg">
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
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setIsDeleteConfirming(false);
        }
      }}
    >
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
