import "server-only";

import { api, getApiClient } from "@/shared/api";

export const getSearchMeetingsApi = async () => {
  try {
    const authedApi = await getApiClient();

    return {
      isAuthenticatedRequest: true,
      meetingsApi: authedApi.meetings,
    };
  } catch {
    return {
      isAuthenticatedRequest: false,
      meetingsApi: api.meetings,
    };
  }
};
