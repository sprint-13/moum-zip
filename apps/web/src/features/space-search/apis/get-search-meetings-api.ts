import { api } from "@/shared/api";
import { getAuthenticatedApi, isAuthenticated } from "@/shared/api/auth-client";

export const getSearchMeetingsApi = async () => {
  if (!(await isAuthenticated())) {
    return {
      isAuthenticatedRequest: false,
      meetingsApi: api.meetings,
    };
  }

  const authedApi = await getAuthenticatedApi();

  return {
    isAuthenticatedRequest: true,
    meetingsApi: authedApi.meetings,
  };
};
