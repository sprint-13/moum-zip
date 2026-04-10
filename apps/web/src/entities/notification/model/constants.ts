import type { NotificationItem, NotificationType } from "@/entities/notification/model/types";

export const NOTIFICATION_LABEL_MAP: Record<NotificationType, string> = {
  MEETING_CONFIRMED: "모임 확정",
  MEETING_CANCELED: "모임 취소",
  MEETING_DELETED: "모임 삭제",
  COMMENT: "새로운 댓글",
  SPACE_MEMBER_ACCEPTED: "가입 승인",
  SPACE_MEMBER_REJECTED: "가입 거절",
};

export function getNotificationTitle(type: NotificationType) {
  return NOTIFICATION_LABEL_MAP[type] ?? "알림";
}

export function getNotificationHref(notification: NotificationItem) {
  switch (notification.type) {
    case "MEETING_CONFIRMED":
    case "MEETING_CANCELED":
      return notification.data.meetingId ? `/moim-detail/${notification.data.meetingId}` : null;

    case "MEETING_DELETED":
      return "/search";

    case "COMMENT":
      return notification.data.postId ? `/posts/${notification.data.postId}` : null;

    case "SPACE_MEMBER_ACCEPTED":
    case "SPACE_MEMBER_REJECTED":
      return notification.data.spaceSlug ? `/spaces/${notification.data.spaceSlug}` : null;

    default:
      return null;
  }
}

export function shouldShowConfirmedIcon(type: NotificationType) {
  return type === "MEETING_CONFIRMED";
}
