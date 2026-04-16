import { redirect } from "next/navigation";
import { getMypagePageData, MypageView, mypageTabs } from "@/_pages/mypage";
import { getMyJoinedMeetings } from "@/_pages/mypage/queries/server";
import { getApi, isAuth } from "@/shared/api/server";
import { ERROR_CODES } from "@/shared/lib/error";
import { normalizeApiError } from "@/shared/lib/errors/normalize-api-error";

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
      <MypageView
        initialFavoriteList={initialFavoriteList}
        profile={profile}
        tabs={mypageTabs}
        moims={moims}
        createdMoims={createdMoims}
      />
    );
  } catch (error) {
    const normalizedError = await normalizeApiError(error, {
      shouldReport: false,
    });

    if (normalizedError.code === ERROR_CODES.UNAUTHORIZED || normalizedError.code === ERROR_CODES.UNAUTHENTICATED) {
      redirect("/login");
    }

    throw normalizedError;
  }
}
