export type NotificationType =
  | "MEETING_CONFIRMED"
  | "MEETING_CANCELED"
  | "MEETING_DELETED"
  | "COMMENT"
  | "SPACE_MEMBER_ACCEPTED"
  | "SPACE_MEMBER_REJECTED";

export interface NotificationData {
  meetingId?: number;
  meetingName?: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  spaceSlug?: string;
  image?: string | null;
}

export interface NotificationItem {
  id: string | number;
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
