import { createContext, useContext } from "react";

// React Context에서 공유할 값의 타입 정의
interface TabsContextValue {
  selectedTab: string; // 현재 선택된 탭
  changeTab: (value: string) => void; // 탭 변경 + 스크롤 위치 저장/복원
}

// Context 생성 (초기값 null)
export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const tabsContext = useContext(TabsContext);

  // Tabs 밖에서 사용 시 에러 발생
  if (!tabsContext) {
    throw new Error("Tabs 내부에서 사용해주세요.");
  }

  return tabsContext;
};
