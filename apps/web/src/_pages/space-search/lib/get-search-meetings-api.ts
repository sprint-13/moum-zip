import "server-only";

import { api } from "@/shared/api";
import { getApi, isAuth } from "@/shared/api/server";

export const getSearchMeetingsApi = async () => {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return {
      isAuthenticatedRequest: false,
      meetingsApi: api.meetings,
    };
  }

  const client = await getApi();

  return {
    isAuthenticatedRequest: true,
    meetingsApi: client.meetings,
  };
};
