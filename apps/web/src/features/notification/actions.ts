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

type NotificationActionError = "UNAUTHORIZED" | "NOT_FOUND" | "UNKNOWN";

export type NotificationActionResult =
  | { ok: true }
  | {
      ok: false;
      error: NotificationActionError;
      message: string;
    };

type GetNotificationsActionResult =
  | {
      ok: true;
      data: Awaited<ReturnType<typeof getNotifications>>["data"];
      nextCursor: Awaited<ReturnType<typeof getNotifications>>["nextCursor"];
      hasMore: Awaited<ReturnType<typeof getNotifications>>["hasMore"];
    }
  | {
      ok: false;
      error: "UNAUTHORIZED" | "UNKNOWN";
      message: string;
      data: [];
      nextCursor: null;
      hasMore: false;
    };

function hasStatus(error: unknown, status: number) {
  return typeof error === "object" && error !== null && "status" in error && error.status === status;
}

export async function getNotificationsAction(
  params: GetNotificationsActionParams = {},
): Promise<GetNotificationsActionResult> {
  const session = await isAuth();

  if (session.userId == null) {
    return {
      ok: false,
      error: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
      data: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  try {
    const result = await getNotifications(params);

    return {
      ok: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  } catch {
    return {
      ok: false,
      error: "UNKNOWN",
      message: "알림을 불러오지 못했습니다.",
      data: [],
      nextCursor: null,
      hasMore: false,
    };
  }
}

export async function readNotificationAction({
  notificationId,
}: ReadNotificationActionParams): Promise<NotificationActionResult> {
  try {
    await readNotification({ notificationId });
    return { ok: true };
  } catch (error) {
    if (hasStatus(error, 401)) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      };
    }

    if (hasStatus(error, 404)) {
      return {
        ok: false,
        error: "NOT_FOUND",
        message: "알림을 찾을 수 없습니다.",
      };
    }

    return {
      ok: false,
      error: "UNKNOWN",
      message: "알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function readSpaceNotificationAction({
  notificationId,
}: ReadSpaceNotificationActionParams): Promise<NotificationActionResult> {
  const session = await isAuth();

  if (session.userId == null) {
    return {
      ok: false,
      error: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
    };
  }

  try {
    await readSpaceNotification({
      userId: session.userId,
      notificationId,
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "UNKNOWN",
      message: "스페이스 알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function readAllNotificationsAction(): Promise<NotificationActionResult> {
  try {
    await readAllNotifications();
    return { ok: true };
  } catch (error) {
    if (hasStatus(error, 401)) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      };
    }

    return {
      ok: false,
      error: "UNKNOWN",
      message: "전체 알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function readAllSpaceNotificationsAction(): Promise<NotificationActionResult> {
  const session = await isAuth();

  if (session.userId == null) {
    return {
      ok: false,
      error: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
    };
  }

  try {
    await readAllSpaceNotifications({ userId: session.userId });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "UNKNOWN",
      message: "스페이스 전체 알림 읽음 처리에 실패했습니다.",
    };
  }
}

export async function deleteAllNotificationsAction(): Promise<NotificationActionResult> {
  try {
    await deleteAllNotifications();
    return { ok: true };
  } catch (error) {
    if (hasStatus(error, 401)) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      };
    }

    return {
      ok: false,
      error: "UNKNOWN",
      message: "전체 알림 삭제에 실패했습니다.",
    };
  }
}

export async function deleteAllSpaceNotificationsAction(): Promise<NotificationActionResult> {
  const session = await isAuth();

  if (session.userId == null) {
    return {
      ok: false,
      error: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
    };
  }

  try {
    await deleteAllSpaceNotifications({ userId: session.userId });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "UNKNOWN",
      message: "스페이스 전체 알림 삭제에 실패했습니다.",
    };
  }
}
