"use server";

import { redirect } from "next/navigation";
import { deleteMeeting } from "@/features/moim-detail/use-cases/delete-meeting";
import { favoriteMeeting } from "@/features/moim-detail/use-cases/favorite-meeting";
import { joinMeeting } from "@/features/moim-detail/use-cases/join-meeting";
import { getApi, isAuth } from "@/shared/api/server";

type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

const getErrorMessage = async (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof Response) {
    try {
      const data = await error.clone().json();

      if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
        return data.message;
      }

      if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
        return data.error;
      }
    } catch {
      try {
        const text = await error.clone().text();
        if (text) {
          return text;
        }
      } catch {}
    }

    return `${error.status} ${error.statusText}`;
  }

  if (typeof error === "object" && error !== null && "error" in error && typeof error.error === "string") {
    return error.error;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};

export async function getCurrentUser(): Promise<ActionResult<{ id: number | null }>> {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return {
      ok: true,
      data: {
        id: null,
      },
    };
  }

  try {
    const api = await getApi();
    const response = await api.user.getUser();
    const user = response.data ?? response;

    return {
      ok: true,
      data: {
        id: user.id ?? null,
      },
    };
  } catch (error) {
    console.error("[getCurrentUser] error:", error);

    return {
      ok: false,
      message: await getErrorMessage(error),
    };
  }
}

export async function favoriteMeetingAction(
  meetingId: number,
  isLiked: boolean,
): Promise<ActionResult<{ meetingId: number; isLiked: boolean }>> {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect("/login");
  }

  try {
    const api = await getApi();

    const result = await favoriteMeeting({ meetingId, isLiked }, { favoritesApi: api.favorites });

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("[favoriteMeetingAction] error:", error);

    return {
      ok: false,
      message: await getErrorMessage(error),
    };
  }
}

export async function joinMeetingAction(
  meetingId: number,
  isJoined: boolean,
): Promise<ActionResult<{ meetingId: number; isJoined: boolean }>> {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect("/login");
  }

  try {
    const api = await getApi();

    const result = await joinMeeting({ meetingId, isJoined }, { meetingsApi: api.meetings });

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("[joinMeetingAction] error:", error);

    return {
      ok: false,
      message: await getErrorMessage(error),
    };
  }
}

export async function deleteMeetingAction(meetingId: number): Promise<ActionResult<{ meetingId: number }>> {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect("/login");
  }

  try {
    const api = await getApi();

    const result = await deleteMeeting({ meetingId }, { meetingsApi: api.meetings });

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("[deleteMeetingAction] error:", error);

    return {
      ok: false,
      message: await getErrorMessage(error),
    };
  }
}
