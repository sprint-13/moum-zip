import { mapNotificationsResponse } from "@/entities/notification/model/mapper";
import type { NotificationItem, NotificationsResult } from "@/entities/notification/model/types";
import { getApi, isAuth } from "@/shared/api/server";
import { getSpaceNotifications } from "./get-space-notifications";

type GetNotificationsParams = {
  isRead?: boolean;
  cursor?: string;
  size?: number;
};

type Deps = {
  getAuthApi?: typeof getApi;
  getSession?: typeof isAuth;
};

export async function getNotifications(
  { isRead, cursor, size = 10 }: GetNotificationsParams = {},
  { getAuthApi = getApi, getSession = isAuth }: Deps = {},
): Promise<NotificationsResult> {
  const authedApi = await getAuthApi();

  const [{ data }, session] = await Promise.all([
    authedApi.notifications.getList({
      ...(typeof isRead === "boolean" ? { isRead: isRead ? "true" : "false" } : {}),
      ...(cursor ? { cursor } : {}),
      size,
    }),
    getSession(),
  ]);

  const externalResult = mapNotificationsResponse(data);

  if (session.userId == null) {
    return serializeNotificationsResult(externalResult);
  }

  const internalNotifications = await getSpaceNotifications({
    userId: session.userId,
    size,
  });

  const filteredInternalNotifications =
    typeof isRead === "boolean"
      ? internalNotifications.filter((notification) => notification.isRead === isRead)
      : internalNotifications;

  const mergedData = [...externalResult.data, ...filteredInternalNotifications]
    .sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a))
    .slice(0, size);

  return serializeNotificationsResult({
    data: mergedData,
    nextCursor: externalResult.nextCursor,
    hasMore: externalResult.hasMore,
  });
}

function getCreatedAtTime(notification: NotificationItem) {
  if (!notification.createdAt) {
    return 0;
  }

  return new Date(notification.createdAt).getTime();
}

function serializeNotificationsResult(result: NotificationsResult): NotificationsResult {
  return {
    data: result.data.map(serializeNotificationItem),
    nextCursor: typeof result.nextCursor === "string" ? result.nextCursor : null,
    hasMore: Boolean(result.hasMore),
  };
}

function serializeNotificationItem(notification: NotificationItem): NotificationItem {
  return {
    id: typeof notification.id === "number" ? notification.id : String(notification.id),
    teamId: String(notification.teamId),
    userId: Number(notification.userId),
    type: notification.type,
    message: String(notification.message),
    data: {
      meetingId: typeof notification.data.meetingId === "number" ? notification.data.meetingId : undefined,
      meetingName: typeof notification.data.meetingName === "string" ? notification.data.meetingName : undefined,
      postId:
        typeof notification.data.postId === "string" || typeof notification.data.postId === "number"
          ? String(notification.data.postId)
          : undefined,
      postTitle: typeof notification.data.postTitle === "string" ? notification.data.postTitle : undefined,
      commentId:
        typeof notification.data.commentId === "string" || typeof notification.data.commentId === "number"
          ? String(notification.data.commentId)
          : undefined,
      spaceSlug:
        typeof notification.data.spaceSlug === "string" || typeof notification.data.spaceSlug === "number"
          ? String(notification.data.spaceSlug)
          : undefined,
      image:
        typeof notification.data.image === "string" || notification.data.image === null
          ? notification.data.image
          : null,
    },
    isRead: Boolean(notification.isRead),
    createdAt: typeof notification.createdAt === "string" ? notification.createdAt : null,
    source: notification.source,
  };
}
