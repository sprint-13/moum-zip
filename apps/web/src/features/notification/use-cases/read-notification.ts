import { getApi } from "@/shared/api/server";

type ReadNotificationParams = {
  notificationId: number | string;
};

type Deps = {
  getAuthApi?: typeof getApi;
};

export async function readNotification({ notificationId }: ReadNotificationParams, { getAuthApi = getApi }: Deps = {}) {
  const authedApi = await getAuthApi();

  const numericId = typeof notificationId === "string" ? Number(notificationId) : notificationId;
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("Invalid notificationId");
  }

  return authedApi.notifications.read(numericId);
}
