import MypagePage from "@/_pages/mypage";
import { createdMoimMockData, mypageMoimMockData, mypageTabs, profileMockData } from "@/_pages/mypage/mock-data";

export default function Page() {
  const moims = {
    joined: mypageMoimMockData.joined,
    liked: mypageMoimMockData.liked,
  };

  return <MypagePage profile={profileMockData} tabs={mypageTabs} moims={moims} createdMoims={createdMoimMockData} />;
}
