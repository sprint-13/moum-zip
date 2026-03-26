import { api } from "@/shared/api";
import { getAuthenticatedApi, isAuthenticated } from "@/shared/api/auth-client";

export const getSearchMeetingsApi = async () => {
  if (!(await isAuthenticated())) {
    return api.meetings;
  }

  const authedApi = await getAuthenticatedApi();

  return authedApi.meetings;
};
