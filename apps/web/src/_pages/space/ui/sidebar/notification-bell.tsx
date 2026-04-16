import type { ComponentProps } from "react";
import { NotificationMenu } from "@/features/notification/ui/notification-menu";
import { getNotifications } from "@/features/notification/use-cases/get-notification";

type NotificationBellProps = Pick<ComponentProps<typeof NotificationMenu>, "desktopSide" | "mobileVariant">;

export async function NotificationBell({ desktopSide, mobileVariant }: NotificationBellProps) {
  const {
    data: notifications,
    nextCursor,
    hasMore,
  } = await getNotifications().catch(() => ({
    data: [],
    nextCursor: null,
    hasMore: false,
  }));

  return (
    <NotificationMenu
      notifications={notifications}
      nextCursor={nextCursor}
      hasMore={hasMore}
      desktopSide={desktopSide}
      mobileVariant={mobileVariant}
    />
  );
}
