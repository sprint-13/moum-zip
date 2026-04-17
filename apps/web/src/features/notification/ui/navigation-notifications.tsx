import { Bell } from "@moum-zip/ui/icons";
import { getNotifications } from "@/features/notification/use-cases/get-notification";
import { NotificationMenu } from "./notification-menu";

export function NotificationBellFallback() {
  return (
    <button
      type="button"
      aria-label="알림 열기"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
      disabled
    >
      <Bell className="h-5 w-5 text-slate-500" />
    </button>
  );
}

export async function NavigationNotificationsServer() {
  const result = await getNotifications({ size: 10 });

  return <NotificationMenu notifications={result.data} nextCursor={result.nextCursor} hasMore={result.hasMore} />;
}
