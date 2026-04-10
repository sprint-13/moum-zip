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

  console.log("query userId 👉", userId);
  console.log("notification rows 👉", rows);

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
    }),
  );
}

function normalizeNotificationData(data: unknown): NotificationItem["data"] {
  if (!data || typeof data !== "object") {
    return {};
  }

  return data as NotificationItem["data"];
}
