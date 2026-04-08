import { notFound, redirect } from "next/navigation";
import { mapMeetingDetailToFormValues } from "@/features/moim-edit/model/mapper";
import type { MeetingDetailForEdit } from "@/features/moim-edit/model/types";
import { getApi, isAuth } from "@/shared/api/server";
import { ROUTES } from "@/shared/config/routes";

type GetMoimEditParams = {
  meetingId: number;
};

type Deps = {
  getAuthApi?: () => ReturnType<typeof getApi>;
  getSession?: typeof isAuth;
};

const isMeetingDetailForEdit = (meeting: unknown): meeting is MeetingDetailForEdit => {
  if (!meeting || typeof meeting !== "object") {
    return false;
  }

  if (!("hostId" in meeting)) {
    return false;
  }

  const { hostId } = meeting as { hostId?: unknown };

  return typeof hostId === "number" || hostId == null;
};

const parseMeetingDetail = (meeting: unknown): MeetingDetailForEdit | null => {
  if (!meeting || typeof meeting !== "object") {
    return null;
  }

  const resolvedMeeting = "data" in meeting ? meeting.data : meeting;

  if (!isMeetingDetailForEdit(resolvedMeeting)) {
    return null;
  }

  return resolvedMeeting;
};

export async function getMoimEdit(
  { meetingId }: GetMoimEditParams,
  { getAuthApi = getApi, getSession = isAuth }: Deps = {},
) {
  const { userId } = await getSession();

  if (userId == null) {
    redirect(ROUTES.login);
  }

  const authedApi = await getAuthApi();

  let meetingDetail: MeetingDetailForEdit | null = null;

  try {
    const meeting = await authedApi.meetings.getDetail(meetingId);
    meetingDetail = parseMeetingDetail(meeting);
  } catch {
    notFound();
  }

  if (!meetingDetail) {
    notFound();
  }

  if (meetingDetail.hostId !== userId) {
    redirect(`${ROUTES.moimDetail}/${meetingId}`);
  }

  return {
    initialValues: mapMeetingDetailToFormValues(meetingDetail),
  };
}
