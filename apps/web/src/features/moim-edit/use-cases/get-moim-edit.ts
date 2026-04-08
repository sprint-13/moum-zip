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

export async function getMoimEdit(
  { meetingId }: GetMoimEditParams,
  { getAuthApi = getApi, getSession = isAuth }: Deps = {},
) {
  const authedApi = await getAuthApi();
  const { userId } = await getSession();

  if (userId == null) {
    redirect(ROUTES.login);
  }

  const meeting = await authedApi.meetings.getDetail(meetingId);

  if (!meeting) {
    notFound();
  }

  const meetingDetail = typeof meeting === "object" && meeting !== null && "data" in meeting ? meeting.data : meeting;

  if (!meetingDetail) {
    notFound();
  }

  if (meetingDetail.hostId !== userId) {
    redirect(`${ROUTES.moimDetail}/${meetingId}`);
  }

  return {
    initialValues: mapMeetingDetailToFormValues(meetingDetail as MeetingDetailForEdit),
  };
}
