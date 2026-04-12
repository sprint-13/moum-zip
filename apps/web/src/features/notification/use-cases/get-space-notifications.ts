import { and, desc, eq, lt, or } from "drizzle-orm";
import type { NotificationItem, NotificationsResult } from "@/entities/notification/model/types";
import { db } from "@/shared/db";
import { notifications } from "@/shared/db/scheme";

type GetSpaceNotificationsParams = {
  userId: number;
  cursor?: string;
  size?: number;
};

type Deps = {
  database?: typeof db;
};

type InternalNotificationCursor = {
  createdAt: string;
  id: string;
};

export async function getSpaceNotifications(
  { userId, cursor, size = 10 }: GetSpaceNotificationsParams,
  { database = db }: Deps = {},
): Promise<NotificationsResult> {
  const parsedCursor = parseCursor(cursor);

  const rows = await database
    .select()
    .from(notifications)
    .where(
      parsedCursor
        ? and(
            eq(notifications.userId, userId),
            or(
              lt(notifications.createdAt, new Date(parsedCursor.createdAt)),
              and(eq(notifications.createdAt, new Date(parsedCursor.createdAt)), lt(notifications.id, parsedCursor.id)),
            ),
          )
        : eq(notifications.userId, userId),
    )
    .orderBy(desc(notifications.createdAt), desc(notifications.id))
    .limit(size + 1);

  const hasMore = rows.length > size;
  const pageRows = hasMore ? rows.slice(0, size) : rows;

  const data = pageRows.map(
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

  const lastRow = pageRows[pageRows.length - 1];

  return {
    data,
    nextCursor:
      hasMore && lastRow?.createdAt
        ? createCursor({
            createdAt: new Date(lastRow.createdAt).toISOString(),
            id: String(lastRow.id),
          })
        : null,
    hasMore,
  };
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

function createCursor(cursor: InternalNotificationCursor) {
  return Buffer.from(JSON.stringify(cursor), "utf-8").toString("base64");
}

function parseCursor(cursor?: string | null): InternalNotificationCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8")) as Partial<InternalNotificationCursor>;

    if (typeof parsed.createdAt !== "string" || typeof parsed.id !== "string") {
      return null;
    }

    return {
      createdAt: parsed.createdAt,
      id: parsed.id,
    };
  } catch {
    return null;
  }
}
