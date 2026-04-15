import type { NotificationItem, NotificationType } from "@/entities/notification/model/types";

export const NOTIFICATION_LABEL_MAP: Record<NotificationType, string> = {
  MEETING_CONFIRMED: "모임 확정",
  MEETING_CANCELED: "모임 취소",
  MEETING_DELETED: "모임 삭제",
  SPACE_MEMBER_ACCEPTED: "가입 승인",
  SPACE_MEMBER_REJECTED: "가입 거절",
  SPACE_POST_CREATED: "새 게시글",
  SPACE_SCHEDULE_CREATED: "새 일정",
  COMMENT: "새로운 댓글",
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

    case "SPACE_MEMBER_ACCEPTED":
      return notification.data.spaceSlug ? `/${notification.data.spaceSlug}` : null;

    case "SPACE_MEMBER_REJECTED":
      return "/search";

    case "SPACE_POST_CREATED":
      return notification.teamId ? `/${notification.teamId}/bulletin` : null;

    case "SPACE_SCHEDULE_CREATED":
      return notification.teamId ? `/${notification.teamId}/schedule` : null;

    case "COMMENT":
      return notification.teamId && notification.data.postId
        ? `/${notification.teamId}/bulletin/${notification.data.postId}`
        : null;

    default:
      return null;
  }
}

export function shouldShowConfirmedIcon(type: NotificationType) {
  return type === "MEETING_CONFIRMED";
}
