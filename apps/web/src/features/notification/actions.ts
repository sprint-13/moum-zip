"use server";

import { deleteAllNotifications } from "@/features/notification/use-cases/delete-all-notifications";
import { deleteAllSpaceNotifications } from "@/features/notification/use-cases/delete-all-space-notifications";
import { getNotifications } from "@/features/notification/use-cases/get-notifications";
import { readAllNotifications } from "@/features/notification/use-cases/read-all-notifications";
import { readAllSpaceNotifications } from "@/features/notification/use-cases/read-all-space-notifications";
import { readNotification } from "@/features/notification/use-cases/read-notification";
import { readSpaceNotification } from "@/features/notification/use-cases/read-space-notification";
import { isAuth } from "@/shared/api/server";

type GetNotificationsActionParams = {
  isRead?: boolean;
  cursor?: string;
  size?: number;
};

type ReadNotificationActionParams = {
  notificationId: number;
};

type ReadSpaceNotificationActionParams = {
  notificationId: string | number;
};

type NotificationActionResult = {
  ok: boolean;
  message?: string;
};

export async function getNotificationsAction(params: GetNotificationsActionParams = {}) {
  return getNotifications(params);
}

export async function readNotificationAction({
  notificationId,
}: ReadNotificationActionParams): Promise<NotificationActionResult> {
  try {
    await readNotification({ notificationId });

    return { ok: true };
  } catch (error) {
    console.error("readNotificationAction error:", error);

    return {
      ok: false,
      message: "알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function readSpaceNotificationAction({
  notificationId,
}: ReadSpaceNotificationActionParams): Promise<NotificationActionResult> {
  try {
    await readSpaceNotification({ notificationId });

    return { ok: true };
  } catch (error) {
    console.error("readSpaceNotificationAction error:", error);

    return {
      ok: false,
      message: "스페이스 알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function readAllNotificationsAction(): Promise<NotificationActionResult> {
  try {
    await readAllNotifications();

    return { ok: true };
  } catch (error) {
    console.error("readAllNotificationsAction error:", error);

    return {
      ok: false,
      message: "전체 알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function readAllSpaceNotificationsAction(): Promise<NotificationActionResult> {
  try {
    const session = await isAuth();

    if (session.userId == null) {
      return {
        ok: false,
        message: "로그인이 필요합니다.",
      };
    }

    await readAllSpaceNotifications({ userId: session.userId });

    return { ok: true };
  } catch (error) {
    console.error("readAllSpaceNotificationsAction error:", error);

    return {
      ok: false,
      message: "스페이스 전체 알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function deleteAllNotificationsAction(): Promise<NotificationActionResult> {
  try {
    await deleteAllNotifications();

    return { ok: true };
  } catch (error) {
    console.error("deleteAllNotificationsAction error:", error);

    return {
      ok: false,
      message: "전체 알림 삭제에 실패했습니다.",
    };
  }
}

export async function deleteAllSpaceNotificationsAction(): Promise<NotificationActionResult> {
  try {
    const session = await isAuth();

    if (session.userId == null) {
      return {
        ok: false,
        message: "로그인이 필요합니다.",
      };
    }

    await deleteAllSpaceNotifications({ userId: session.userId });

    return { ok: true };
  } catch (error) {
    console.error("deleteAllSpaceNotificationsAction error:", error);

    return {
      ok: false,
      message: "스페이스 전체 알림 삭제에 실패했습니다.",
    };
  }
}
