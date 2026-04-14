import { and, eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type ReadAllSpaceNotificationsParams = {
  userId: number;
};

type Deps = {
  database?: typeof db;
};

export async function readAllSpaceNotifications(
  { userId }: ReadAllSpaceNotificationsParams,
  { database = db }: Deps = {},
) {
  await database
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return { success: true };
}
