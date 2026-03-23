import MypagePage from "@/_pages/mypage";
import { createdMoimMockData, mypageMoimMockData, mypageTabs, profileMockData } from "@/_pages/mypage/mock-data";

export default function Page() {
  return (
    <MypagePage
      profile={profileMockData}
      tabs={mypageTabs}
      moims={mypageMoimMockData}
      createdMoims={createdMoimMockData}
    />
  );
}
