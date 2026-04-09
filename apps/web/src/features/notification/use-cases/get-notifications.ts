import { mapNotificationsResponse } from "@/entities/notification/model/mapper";
import type { NotificationsResult } from "@/entities/notification/model/types";
import { getApi } from "@/shared/api/server";

type GetNotificationsParams = {
  isRead?: boolean;
  cursor?: string;
  size?: number;
};

type Deps = {
  getAuthApi?: typeof getApi;
};

export async function getNotifications(
  { isRead, cursor, size = 10 }: GetNotificationsParams = {},
  { getAuthApi = getApi }: Deps = {},
): Promise<NotificationsResult> {
  const authedApi = await getAuthApi();

  const { data } = await authedApi.notifications.getList({
    ...(typeof isRead === "boolean" ? { isRead: isRead ? "true" : "false" } : {}),
    ...(cursor ? { cursor } : {}),
    size,
  });

  return mapNotificationsResponse(data);
}
