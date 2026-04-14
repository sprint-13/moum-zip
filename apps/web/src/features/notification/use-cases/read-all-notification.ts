import { getApi } from "@/shared/api/server";

type Deps = {
  getAuthApi?: typeof getApi;
};

export async function readAllNotifications(_: void = undefined, { getAuthApi = getApi }: Deps = {}) {
  const authedApi = await getAuthApi();

  return authedApi.notifications.readAll();
}
