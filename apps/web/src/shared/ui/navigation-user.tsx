import Link from "next/link";
import { cache } from "react";
import { getApi } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";
import { ProfileAvatar } from "@/shared/ui/profile-avatar";

const getNavigationUser = cache(async () => {
  try {
    const api = await getApi();
    const response = await api.user.getUser();

    return {
      imageUrl: response.data.image ?? undefined,
      name: response.data.name,
    };
  } catch {
    return null;
  }
});

export async function NavigationUserServer() {
  const user = await getNavigationUser();

  return (
    <Link
      href={ROUTES.mypage}
      aria-label="마이페이지로 이동"
      className="inline-flex shrink-0 rounded-full px-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1"
    >
      <ProfileAvatar
        className="size-10 border-border"
        src={user?.imageUrl}
        alt={user?.name ? `${user.name} 프로필 이미지` : "프로필 이미지"}
      />
    </Link>
  );
}
