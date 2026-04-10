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

  console.log("session 👉", session);
  console.log("externalResult 👉", externalResult);

  if (session.userId == null) {
    return externalResult;
  }

  const internalNotifications = await getSpaceNotifications({
    userId: session.userId,
    size,
  });

  console.log("internalNotifications 👉", internalNotifications);

  const filteredInternalNotifications =
    typeof isRead === "boolean"
      ? internalNotifications.filter((notification) => notification.isRead === isRead)
      : internalNotifications;

  const mergedData = [...externalResult.data, ...filteredInternalNotifications]
    .sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a))
    .slice(0, size);

  console.log("mergedData 👉", mergedData);

  return {
    data: mergedData,
    nextCursor: externalResult.nextCursor,
    hasMore: externalResult.hasMore,
  };
}

function getCreatedAtTime(notification: NotificationItem) {
  if (!notification.createdAt) {
    return 0;
  }

  return new Date(notification.createdAt).getTime();
}
