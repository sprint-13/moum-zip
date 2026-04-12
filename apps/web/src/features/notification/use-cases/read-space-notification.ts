import { eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type ReadSpaceNotificationParams = {
  notificationId: string | number;
};

type Deps = {
  database?: typeof db;
};

export async function readSpaceNotification(
  { notificationId }: ReadSpaceNotificationParams,
  { database = db }: Deps = {},
) {
  await database
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, String(notificationId)));

  return { success: true };
}
