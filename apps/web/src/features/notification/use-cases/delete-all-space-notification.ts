import { eq } from "drizzle-orm";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type DeleteAllSpaceNotificationsParams = {
  userId: number;
};

type Deps = {
  database?: typeof db;
};

export async function deleteAllSpaceNotifications(
  { userId }: DeleteAllSpaceNotificationsParams,
  { database = db }: Deps = {},
) {
  await database.delete(notifications).where(eq(notifications.userId, userId));
}
