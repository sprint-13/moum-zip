export type NotificationType =
  | "MEETING_CONFIRMED"
  | "MEETING_CANCELED"
  | "MEETING_DELETED"
  | "SPACE_MEMBER_ACCEPTED"
  | "SPACE_MEMBER_REJECTED"
  | "SPACE_POST_CREATED"
  | "SPACE_SCHEDULE_CREATED"
  | "COMMENT";

export interface NotificationData {
  meetingId?: number;
  meetingName?: string;
  postId?: string;
  postTitle?: string;
  commentId?: string;
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
