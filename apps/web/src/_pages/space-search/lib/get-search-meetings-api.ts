import "server-only";

import { api } from "@/shared/api";
import { getApiClient, isAuth } from "@/shared/api/server";

export const getSearchMeetingsApi = async () => {
  const authenticated = await isAuth();

  if (!authenticated) {
    return {
      isAuthenticatedRequest: false,
      meetingsApi: api.meetings,
    };
  }

  const authedApi = await getApiClient();
  return {
    isAuthenticatedRequest: true,
    meetingsApi: authedApi.meetings,
  };
};
