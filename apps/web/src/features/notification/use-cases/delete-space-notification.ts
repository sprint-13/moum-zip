import { and, eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type DeleteSpaceNotificationParams = {
  notificationId: string | number;
  userId: number;
};

type Deps = {
  database?: typeof db;
};

export async function deleteSpaceNotification(
  { notificationId, userId }: DeleteSpaceNotificationParams,
  { database = db }: Deps = {},
) {
  await database
    .delete(notifications)
    .where(and(eq(notifications.id, String(notificationId)), eq(notifications.userId, userId)));
}
