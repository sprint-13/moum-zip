import type { NotificationItem } from "@/entities/notification/model/types";
import { NotificationListItem } from "@/features/notification/ui/notification-list-item";

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isMobile?: boolean;
  isDeleteConfirming?: boolean;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onReadAll?: () => void | Promise<void>;
  onDeleteAll?: () => void | Promise<void>;
  onCancelDeleteAll?: () => void | Promise<void>;
  onConfirmDeleteAll?: () => void | Promise<void>;
  onItemClick?: (notification: NotificationItem) => void | Promise<void>;
  onLoadMore?: () => void | Promise<void>;
}

export function NotificationPanel({
  notifications,
  isMobile = false,
  isDeleteConfirming = false,
  hasMore = false,
  isFetchingMore = false,
  onReadAll,
  onDeleteAll,
  onCancelDeleteAll,
  onConfirmDeleteAll,
  onItemClick,
  onLoadMore,
}: NotificationPanelProps) {
  const hasUnread = notifications.some((notification) => !notification.isRead);
  const hasNotifications = notifications.length > 0;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 24;

    if (reachedBottom && hasMore && !isFetchingMore) {
      onLoadMore?.();
    }
  };

  return (
    <section className="flex h-full min-h-[204px] flex-col overflow-hidden rounded-2xl bg-white">
      <header className={["flex items-center justify-between px-5 py-4", isMobile ? "shrink-0" : ""].join(" ")}>
        {isDeleteConfirming ? (
          <>
            <p className="font-medium text-foreground text-sm">모든 알림을 삭제할까요?</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onCancelDeleteAll?.()}
                className="font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
              >
                취소
              </button>

              <button
                type="button"
                onClick={() => onConfirmDeleteAll?.()}
                className="font-medium text-primary text-xs transition-opacity hover:opacity-80"
              >
                삭제
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-base text-foreground">알림</h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onReadAll?.()}
                disabled={!hasUnread}
                className={[
                  "font-medium text-xs transition-colors",
                  hasUnread ? "text-primary hover:opacity-80" : "cursor-default text-muted-foreground/40",
                ].join(" ")}
              >
                모두 읽기
              </button>

              <button
                type="button"
                onClick={() => onDeleteAll?.()}
                disabled={!hasNotifications}
                className={[
                  "font-medium text-xs transition-colors",
                  hasNotifications
                    ? "text-muted-foreground hover:text-foreground"
                    : "cursor-default text-muted-foreground/40",
                ].join(" ")}
              >
                전체 삭제
              </button>
            </div>
          </>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 text-muted-foreground text-sm">
          아직 알림이 없어요
        </div>
      ) : (
        <div
          onScroll={handleScroll}
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
            <div key={`${notification.source}-${notification.id}`}>
              <NotificationListItem notification={notification} isMobile={isMobile} onClick={onItemClick} />
            </div>
          ))}

          {!hasMore ? (
            <div className="px-5 py-3 text-center text-muted-foreground/70 text-xs">모든 알림을 확인했어요</div>
          ) : null}
        </div>
      )}
    </section>
  );
}
