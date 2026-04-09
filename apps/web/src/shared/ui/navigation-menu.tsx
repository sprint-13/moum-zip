import { getApi, isAuth } from "@/shared/api/server";
import { NavigationMenuClient } from "./navigation-menu-client";

type NavigationUser = {
  imageUrl?: string;
  name?: string;
};

type NavigationNotification = {
  id: number;
  teamId: string;
  userId: number;
  type: "MEETING_CONFIRMED" | "MEETING_CANCELED" | "COMMENT";
  message: string;
  data: {
    meetingId?: number;
    meetingName?: string;
    postId?: number;
    postTitle?: string;
    commentId?: number;
    image?: string | null;
  };
  isRead: boolean;
  createdAt: string | null;
};

async function getNavigationUser(): Promise<NavigationUser | null> {
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
}

async function getNavigationNotifications(): Promise<NavigationNotification[]> {
  try {
    const api = await getApi();
    const response = await api.notifications.getList({ size: 10 });

    return (response.data.data ?? []).map((item) => ({
      id: item.id,
      teamId: item.teamId,
      userId: item.userId,
      type: item.type,
      message: item.message,
      data: {
        meetingId: item.data?.meetingId,
        meetingName: item.data?.meetingName,
        postId: item.data?.postId,
        postTitle: item.data?.postTitle,
        commentId: item.data?.commentId,
        image: item.data?.image ?? null,
      },
      isRead: item.isRead,
      createdAt: item.createdAt ?? null,
    }));
  } catch {
    return [];
  }
}

export async function NavigationMenu() {
  const { authenticated } = await isAuth();

  const [user, notifications] = authenticated
    ? await Promise.all([getNavigationUser(), getNavigationNotifications()])
    : [null, []];

  return <NavigationMenuClient loggedIn={authenticated} user={user} notifications={notifications} />;
}
