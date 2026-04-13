import type { NotificationsListData } from "@moum-zip/api/data-contracts";
import type { NotificationItem, NotificationsResult } from "@/entities/notification/model/types";

type RawNotification = NonNullable<NotificationsListData["data"]>[number];

export function mapNotification(raw: RawNotification): NotificationItem {
  const rawData = raw.data && typeof raw.data === "object" ? (raw.data as Record<string, unknown>) : null;

  return {
    id: raw.id,
    teamId: raw.teamId,
    userId: raw.userId,
    type: raw.type,
    message: raw.message,
    data: {
      meetingId: raw.data?.meetingId,
      meetingName: raw.data?.meetingName,
      postId: raw.data?.postId != null ? String(raw.data.postId) : undefined,
      postTitle: raw.data?.postTitle,
      commentId: raw.data?.commentId != null ? String(raw.data.commentId) : undefined,
      commentAuthorName: typeof rawData?.commentAuthorName === "string" ? rawData.commentAuthorName : undefined,
      commentContent: typeof rawData?.commentContent === "string" ? rawData.commentContent : undefined,
      image: typeof rawData?.image === "string" ? rawData.image : null,
    },
    isRead: raw.isRead,
    createdAt: raw.createdAt ?? null,
    source: "external",
  };
}

export function mapNotificationsResponse(response: NotificationsListData): NotificationsResult {
  return {
    data: (response.data ?? []).map(mapNotification),
    nextCursor: response.nextCursor ?? null,
    hasMore: response.hasMore ?? false,
  };
}
