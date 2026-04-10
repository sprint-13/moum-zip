export type NotificationType = "MEETING_CONFIRMED" | "MEETING_CANCELED" | "MEETING_DELETED" | "COMMENT";

export interface NotificationData {
  meetingId?: number;
  meetingName?: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  image?: string | null;
}

export interface NotificationItem {
  id: number;
  teamId: string;
  userId: number;
  type: NotificationType;
  message: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: string | null;
}

export interface NotificationsResult {
  data: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
}
