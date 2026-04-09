import type { NotificationItem, NotificationType } from "@/entities/notification/model/types";

export const NOTIFICATION_LABEL_MAP: Record<NotificationType, string> = {
  MEETING_CONFIRMED: "모임 개설 확정",
  MEETING_CANCELED: "모임 취소",
  COMMENT: "댓글",
};

export function getNotificationHref(notification: NotificationItem) {
  switch (notification.type) {
    case "MEETING_CONFIRMED":
    case "MEETING_CANCELED":
      return notification.data.meetingId ? `/moim-detail/${notification.data.meetingId}` : null;

    case "COMMENT":
      return notification.data.postId ? `/posts/${notification.data.postId}` : null;

    default:
      return null;
  }
}
