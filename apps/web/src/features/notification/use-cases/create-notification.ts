import { randomUUID } from "crypto";
import type { NotificationData, NotificationType } from "@/entities/notification/model/types";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type CreateNotificationParams = {
  teamId: string;
  userId: number;
  type: NotificationType;
  message: string;
  data?: NotificationData;
};

type Deps = {
  database?: typeof db;
  createId?: () => string;
};

export async function createNotification(
  { teamId, userId, type, message, data = {} }: CreateNotificationParams,
  { database = db, createId = randomUUID }: Deps = {},
) {
  const [notification] = await database
    .insert(notifications)
    .values({
      id: createId(),
      teamId,
      userId,
      type,
      message,
      data,
      isRead: false,
    })
    .returning();

  return notification;
}
