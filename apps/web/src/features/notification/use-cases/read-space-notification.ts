import { and, eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type ReadSpaceNotificationParams = {
  notificationId: string | number;
  userId: number;
};

type Deps = {
  database?: typeof db;
};

export async function readSpaceNotification(
  { notificationId, userId }: ReadSpaceNotificationParams,
  { database = db }: Deps = {},
) {
  await database
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, String(notificationId)), eq(notifications.userId, userId)));

  return { success: true };
}
