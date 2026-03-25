import { Users } from "@moum-zip/api";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/cookies";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://dallaem-backend.vercel.app";
const teamId = process.env.NEXT_PUBLIC_TEAM_ID || "dallaem";

export async function getMyJoinedMeetings() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const usersApi = new Users({
    baseUrl,
    securityWorker: () => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
  });

  return usersApi.meMeetingsList(teamId, {
    type: "joined",
    sortBy: "dateTime",
    sortOrder: "asc",
    size: 10,
  });
}
