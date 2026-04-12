import { desc, eq } from "drizzle-orm";
import type { NotificationItem } from "@/entities/notification/model/types";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type GetSpaceNotificationsParams = {
  userId: number;
  size?: number;
};

type Deps = {
  database?: typeof db;
};

export async function getSpaceNotifications(
  { userId, size = 10 }: GetSpaceNotificationsParams,
  { database = db }: Deps = {},
): Promise<NotificationItem[]> {
  const rows = await database
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(size);

  return rows.map(
    (row): NotificationItem => ({
      id: row.id,
      teamId: row.teamId,
      userId: row.userId,
      type: row.type as NotificationItem["type"],
      message: row.message,
      data: normalizeNotificationData(row.data),
      isRead: row.isRead,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
      source: "internal",
    }),
  );
}

function normalizeNotificationData(data: unknown): NotificationItem["data"] {
  if (!data || typeof data !== "object") {
    return {};
  }

  const value = data as Record<string, unknown>;

  return {
    meetingId: typeof value.meetingId === "number" ? value.meetingId : undefined,
    meetingName: typeof value.meetingName === "string" ? value.meetingName : undefined,
    postId: typeof value.postId === "string" || typeof value.postId === "number" ? String(value.postId) : undefined,
    postTitle: typeof value.postTitle === "string" ? value.postTitle : undefined,
    commentId:
      typeof value.commentId === "string" || typeof value.commentId === "number" ? String(value.commentId) : undefined,
    spaceSlug: typeof value.spaceSlug === "string" ? value.spaceSlug : undefined,
    image: typeof value.image === "string" || value.image === null ? value.image : null,
  };
}
