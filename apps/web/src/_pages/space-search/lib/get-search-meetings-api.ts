import "server-only";

import { api } from "@/shared/api";
import { getApiClient } from "@/shared/api/server";

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
