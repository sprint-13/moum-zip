import { redirect } from "next/navigation";
import MypagePage, { getMypagePageData, mypageTabs } from "@/_pages/mypage";
import { getMyJoinedMeetings } from "@/_pages/mypage/queries/server";
import { getApi, isAuth } from "@/shared/api/server";

function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Response) {
    return error.status === 401;
  }

  return error instanceof Error && error.message.includes("401");
}

export default async function Page() {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect("/login");
  }

  try {
    const authedApi = await getApi();
    // created 탭은 클라이언트 query로 실제 목록을 조회하고, 서버에서는 초기 fallback만 전달합니다.
    const { initialFavoriteList, profile, moims, createdMoims } = await getMypagePageData({
      getUser: () => authedApi.user.getUser(),
      getJoinedMeetings: () => getMyJoinedMeetings(),
      getFavoritesPage: (cursor) => authedApi.favorites.getList({ size: 100, cursor }),
    });

    return (
      <MypagePage
        initialFavoriteList={initialFavoriteList}
        profile={profile}
        tabs={mypageTabs}
        moims={moims}
        createdMoims={createdMoims}
      />
    );
  } catch (error) {
    if (isUnauthorizedError(error)) {
      redirect("/login");
    }

    throw error;
  }
}
