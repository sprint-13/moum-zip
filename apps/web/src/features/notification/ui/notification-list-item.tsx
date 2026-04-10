"use client";

import Image from "next/image";
import { getNotificationTitle, shouldShowConfirmedIcon } from "@/entities/notification/model/constants";
import type { NotificationItem } from "@/entities/notification/model/types";
import CheckCircleIcon from "@/features/notification/ui/icons/check-circle-icon.svg";

interface NotificationListItemProps {
  notification: NotificationItem;
  isMobile?: boolean;
}

function formatRelativeTime(createdAt: string | null) {
  if (!createdAt) return "";

  const diff = Date.now() - new Date(createdAt).getTime();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  return `${Math.floor(diff / day)}일 전`;
}

export function NotificationListItem({ notification, isMobile = false }: NotificationListItemProps) {
  const title = getNotificationTitle(notification.type);
  const showConfirmedIcon = shouldShowConfirmedIcon(notification.type);

  return (
    <button
      type="button"
      className={[
        "flex w-full items-start gap-3 text-left hover:bg-muted/30",
        isMobile ? "px-5 py-4" : "px-5 py-4",
      ].join(" ")}
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-muted">
        {notification.data.image ? (
          <Image src={notification.data.image} alt="" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.6875rem] text-muted-foreground">
            알림
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1">
          <strong className="font-semibold text-foreground text-xs">{title}</strong>

          {showConfirmedIcon ? <CheckCircleIcon /> : null}
        </div>

        <p className="whitespace-pre-line break-words text-muted-foreground text-sm leading-5">
          {notification.message}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
        {!notification.isRead ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}

        <span className="text-muted-foreground text-xs">{formatRelativeTime(notification.createdAt)}</span>
      </div>
    </button>
  );
}
