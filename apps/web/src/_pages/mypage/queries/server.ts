import { Users } from "@moum-zip/api";
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
  sortBy?: "dateTime" | "joinedAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  size?: number;
  cursor?: string;
};

export async function getMyMeetings(query: MyMeetingsServerQuery) {
  const { baseUrl, teamId } = getMypageServerConfig();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const usersApi = new Users({
    baseUrl,
    securityWorker: () => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
  });

  return usersApi.meMeetingsList(teamId, query);
}

export async function getMyJoinedMeetings() {
  return getMyMeetings({
    type: "joined",
    sortBy: "dateTime",
    sortOrder: "asc",
    size: 10,
  });
}
