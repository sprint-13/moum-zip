import { NavigationMenuClient } from "@/shared/ui/navigation-menu-client";

export const SpaceSearchHeader = () => {
  return (
    <header className="bg-background-secondary">
      <NavigationMenuClient loggedIn={false} /> {/* TODO: auth 연결 후 실제 로그인 상태로 교체 */}
    </header>
  );
};
