import { redirect } from "next/navigation";
import MypagePage from "@/_pages/mypage";
import { mypageTabs } from "@/_pages/mypage/mock-data";
import { mapJoinedMeeting, mapProfile } from "@/_pages/mypage/model/mappers";
import type { MypageMoimCard } from "@/_pages/mypage/model/types";
import { getMyJoinedMeetings } from "@/_pages/mypage/queries";
import { getAuthenticatedApi, isAuthenticated } from "@/shared/api/auth-client";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Response) {
    return error.status === 401;
  }

  return error instanceof Error && error.message.includes("401");
}

export default async function Page() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  try {
    const authedApi = await getAuthenticatedApi();

    const [{ data: user }, { data: joinedMeetings }, { data: favoritesList }] = await Promise.all([
      authedApi.user.getUser(),
      getMyJoinedMeetings(),
      authedApi.favorites.getList({ size: 100 }),
    ]);

    const profile = mapProfile(user);
    const favoriteMeetingIds = new Set(favoritesList.data.map((favorite) => favorite.meetingId));
    const moims: Record<"joined" | "liked", MypageMoimCard[]> = {
      joined: joinedMeetings.data.map((meeting, index) =>
        mapJoinedMeeting(meeting, index, favoriteMeetingIds.has(meeting.id)),
      ),
      liked: [],
    };
    const createdMoims: Record<"ongoing" | "ended", MypageMoimCard[]> = {
      ongoing: [],
      ended: [],
    };

    return <MypagePage profile={profile} tabs={mypageTabs} moims={moims} createdMoims={createdMoims} />;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      redirect("/login");
    }

    throw error;
  }
}
