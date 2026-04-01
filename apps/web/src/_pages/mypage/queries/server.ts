import { Meetings } from "@moum-zip/api";
import { cookies } from "next/headers";
import { getApi } from "@/shared/api/server";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/cookies";

export interface MyMeetingsServerQuery {
  type: "joined" | "created";
  completed?: "true" | "false";
  reviewed?: "true" | "false";
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt" | "participantCount";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
}

const getCreatedMeetingsApi = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID;

  if (!baseUrl || !teamId) {
    throw new Error("MYPAGE_SERVER_CONFIG_MISSING");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  return {
    meetingsApi: new Meetings({
      baseUrl,
      securityWorker: () => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
    }),
    teamId,
  };
};

export const getMyMeetings = async (query: MyMeetingsServerQuery) => {
  if (query.type === "joined") {
    const api = await getApi();

    return api.meetings.getJoined({
      completed: query.completed,
      reviewed: query.reviewed,
      sortBy:
        query.sortBy === "dateTime" || query.sortBy === "registrationEnd" || query.sortBy === "joinedAt"
          ? query.sortBy
          : undefined,
      sortOrder: query.sortOrder,
      size: query.size,
      cursor: query.cursor,
    });
  }

  const { meetingsApi, teamId } = await getCreatedMeetingsApi();

  return meetingsApi.getMeetings(teamId, {
    sortBy:
      query.sortBy === "dateTime" || query.sortBy === "registrationEnd" || query.sortBy === "participantCount"
        ? query.sortBy
        : undefined,
    sortOrder: query.sortOrder,
    size: query.size,
    cursor: query.cursor,
  });
};

export const getMyJoinedMeetings = async () => {
  const api = await getApi();

  return api.meetings.getJoined({
    sortBy: "dateTime",
    sortOrder: "asc",
    size: 10,
  });
};
