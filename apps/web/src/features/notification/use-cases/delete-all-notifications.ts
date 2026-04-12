import { getApi } from "@/shared/api/server";

type Deps = {
  getAuthApi?: typeof getApi;
};

export async function deleteAllNotifications({ getAuthApi = getApi }: Deps = {}) {
  const authedApi = await getAuthApi();
  await authedApi.notifications.deleteAll();
}
