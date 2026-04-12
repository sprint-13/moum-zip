import type { NotificationsResult } from "@/entities/notification/model/types";
import { getNotifications } from "@/features/notification/use-cases/get-notifications";
import { getApi, isAuth } from "@/shared/api/server";
import { NavigationMenuClient } from "./navigation-menu-client";

type NavigationUser = {
  imageUrl?: string;
  name?: string;
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

async function getNavigationNotifications(): Promise<NotificationsResult> {
  try {
    const result = await getNotifications({ size: 10 });

    return JSON.parse(JSON.stringify(result)) as NotificationsResult;
  } catch {
    return {
      data: [],
      nextCursor: null,
      hasMore: false,
    };
  }
}

export async function NavigationMenu() {
  const { authenticated } = await isAuth();

  const [user, notificationsResult] = authenticated
    ? await Promise.all([getNavigationUser(), getNavigationNotifications()])
    : [
        null,
        {
          data: [],
          nextCursor: null,
          hasMore: false,
        },
      ];

  return (
    <NavigationMenuClient
      loggedIn={authenticated}
      user={user}
      notifications={notificationsResult.data}
      nextCursor={notificationsResult.nextCursor}
      hasMore={notificationsResult.hasMore}
    />
  );
}
