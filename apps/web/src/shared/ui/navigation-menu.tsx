import { Users } from "@moum-zip/api";
import { cookies } from "next/headers";
import { isAuth } from "@/shared/api/server";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/cookies";
import { NavigationMenuClient } from "./navigation-menu-client";

type NavigationUser = {
  imageUrl?: string;
  name?: string;
};

async function getNavigationUser(): Promise<NavigationUser | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID;

  if (!baseUrl || !teamId) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const usersApi = new Users({
      baseUrl,
      securityWorker: () => ({ headers: { Authorization: `Bearer ${accessToken}` } }),
    });
    const response = await usersApi.getUsers(teamId);

    return {
      imageUrl: response.data.image ?? undefined,
      name: response.data.name ?? undefined,
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
