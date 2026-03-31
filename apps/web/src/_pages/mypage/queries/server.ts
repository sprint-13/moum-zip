import { Meetings } from "@moum-zip/api";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/cookies";

function getMypageServerConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID;

  if (!baseUrl || !teamId) {
    throw new Error("MYPAGE_SERVER_CONFIG_MISSING");
  }

  return { baseUrl, teamId };
}

export type MyMeetingsServerQuery = {
  type: "joined" | "created";
  completed?: "true" | "false";
  reviewed?: "true" | "false";
  sortBy?: "dateTime" | "registrationEnd" | "joinedAt" | "participantCount";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
};

export async function getMyMeetings(query: MyMeetingsServerQuery) {
  const { baseUrl, teamId } = getMypageServerConfig();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const meetingsApi = new Meetings({
    baseUrl,
    securityWorker: () => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
  });

  if (query.type === "joined") {
    return meetingsApi.joinedList(teamId, {
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

  return meetingsApi.getMeetings(teamId, {
    sortBy:
      query.sortBy === "dateTime" || query.sortBy === "registrationEnd" || query.sortBy === "participantCount"
        ? query.sortBy
        : undefined,
    sortOrder: query.sortOrder,
    size: query.size,
    cursor: query.cursor,
  });
}

export async function getMyJoinedMeetings() {
  const { baseUrl, teamId } = getMypageServerConfig();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const meetingsApi = new Meetings({
    baseUrl,
    securityWorker: () => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
  });

  return meetingsApi.joinedList(teamId, {
    sortBy: "dateTime",
    sortOrder: "asc",
    size: 10,
  });
}
