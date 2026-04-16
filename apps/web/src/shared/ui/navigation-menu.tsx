import { Suspense } from "react";
import {
  NavigationNotificationsServer,
  NotificationBellFallback,
} from "@/features/notification/ui/navigation-notifications";
import { isAuth } from "@/shared/api/server";
import { NavigationMenuClient } from "./navigation-menu-client";
import { NavigationUserServer } from "./navigation-user";

export async function NavigationMenu() {
  const { authenticated } = await isAuth();

  const notificationsSlot = authenticated ? (
    <Suspense fallback={<NotificationBellFallback />}>
      <NavigationNotificationsServer />
    </Suspense>
  ) : null;

  const userSlot = authenticated ? (
    <Suspense fallback={null}>
      <NavigationUserServer />
    </Suspense>
  ) : null;

  return <NavigationMenuClient loggedIn={authenticated} notificationsSlot={notificationsSlot} userSlot={userSlot} />;
}
