import { isAuth } from "@/shared/api";
import { NavigationMenuClient } from "./navigation-menu-client";

export async function NavigationMenu() {
  const { authenticated } = await isAuth();
  return <NavigationMenuClient loggedIn={authenticated} />;
}
