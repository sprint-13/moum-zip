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

export async function NavigationMenu() {
  const { authenticated } = await isAuth();

  const user = authenticated ? await getNavigationUser() : null;

  return <NavigationMenuClient loggedIn={authenticated} user={user} />;
}
