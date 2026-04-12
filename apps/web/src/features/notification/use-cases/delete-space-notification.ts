import { eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type DeleteSpaceNotificationParams = {
  notificationId: string | number;
};

type Deps = {
  database?: typeof db;
};

export async function deleteSpaceNotification(
  { notificationId }: DeleteSpaceNotificationParams,
  { database = db }: Deps = {},
) {
  await database.delete(notifications).where(eq(notifications.id, String(notificationId)));
}
