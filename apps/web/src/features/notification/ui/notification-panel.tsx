import type { NotificationItem } from "@/entities/notification/model/types";
import { NotificationListItem } from "@/features/notification/ui/notification-list-item";

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isMobile?: boolean;
  onReadAll?: () => void | Promise<void>;
  onItemClick?: (notification: NotificationItem) => void | Promise<void>;
}

export function NotificationPanel({ notifications, isMobile = false, onReadAll, onItemClick }: NotificationPanelProps) {
  const hasUnread = notifications.some((notification) => !notification.isRead);

  return (
    <section className="flex h-full min-h-[204px] flex-col overflow-hidden rounded-2xl bg-white">
      <header className={["flex items-center justify-between px-5 py-4", isMobile ? "shrink-0" : ""].join(" ")}>
        <h2 className="font-semibold text-base text-foreground">알림 내역</h2>

        <button
          type="button"
          onClick={() => onReadAll?.()}
          disabled={!hasUnread}
          className={[
            "font-medium text-xs transition-colors",
            hasUnread ? "text-muted-foreground hover:text-foreground" : "cursor-default text-muted-foreground/40",
          ].join(" ")}
        >
          모두 읽기
        </button>
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 text-muted-foreground text-sm">
          아직 알림이 없어요
        </div>
      ) : (
        <div
          className={[
            "overflow-y-auto",
            isMobile ? "flex-1" : "max-h-[22rem]",
            "[scrollbar-width:thin]",
            "[scrollbar-color:rgba(0,0,0,0.18)_transparent]",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:bg-black/15",
            "hover:[&::-webkit-scrollbar-thumb]:bg-black/25",
          ].join(" ")}
        >
          {notifications.map((notification) => (
            <div key={notification.id}>
              <NotificationListItem notification={notification} isMobile={isMobile} onClick={onItemClick} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
