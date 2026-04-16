"use server";

import { redirect } from "next/navigation";
import { getErrorMessage } from "@/_pages/moim-detail/lib/get-error-message";
import { deleteMeeting } from "@/features/moim-detail/use-cases/delete-meeting";
import { favoriteMeeting } from "@/features/moim-detail/use-cases/favorite-meeting";
import { getCurrentUser } from "@/features/moim-detail/use-cases/get-current-user";
import { joinMeeting } from "@/features/moim-detail/use-cases/join-meeting";
import { getApi, isAuth } from "@/shared/api/server";
import { reportError } from "@/shared/lib/errors/report-error";

type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

type CurrentUserData = {
  id: number | null;
  name: string | null;
  image: string | null;
};

const EMPTY_USER: CurrentUserData = {
  id: null,
  name: null,
  image: null,
};

async function requireAuth() {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    redirect("/login");
  }
}

export async function getCurrentUserAction(): Promise<ActionResult<CurrentUserData>> {
  const { authenticated } = await isAuth();

  if (!authenticated) {
    return {
      ok: true,
      data: EMPTY_USER,
    };
  }

  try {
    const api = await getApi();

    const data = await getCurrentUser({
      getUser: async () => {
        const response = await api.user.getUser();
        return response.data ?? response;
      },
    });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    await reportError(error, {
      tags: { scope: "moim-detail-action", stage: "get-current-user" },
    });
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
  await requireAuth();

  try {
    const api = await getApi();
    const data = await favoriteMeeting({ meetingId, isLiked }, { favoritesApi: api.favorites });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    await reportError(error, {
      tags: { scope: "moim-detail-action", stage: "favorite" },
    });
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
  await requireAuth();

  try {
    const api = await getApi();
    const data = await joinMeeting({ meetingId, isJoined }, { meetingsApi: api.meetings });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    await reportError(error, {
      tags: { scope: "moim-detail-action", stage: "join" },
    });
    return {
      ok: false,
      message: await getErrorMessage(error),
    };
  }
}

export async function deleteMeetingAction(meetingId: number): Promise<ActionResult<{ meetingId: number }>> {
  await requireAuth();

  try {
    const api = await getApi();
    const data = await deleteMeeting({ meetingId }, { meetingsApi: api.meetings });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    await reportError(error, {
      tags: { scope: "moim-detail-action", stage: "delete" },
    });
    return {
      ok: false,
      message: await getErrorMessage(error),
    };
  }
}
