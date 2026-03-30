import "server-only";

import { api } from "@/shared/api";
import { getApi } from "@/shared/api/server";

export const getSearchMeetingsApi = async () => {
  try {
    const api = await getApi();

    return {
      isAuthenticatedRequest: true,
      meetingsApi: api.meetings,
    };
  } catch {
    return {
      isAuthenticatedRequest: false,
      meetingsApi: api.meetings,
    };
  }
};
