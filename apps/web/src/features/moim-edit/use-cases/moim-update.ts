import type { MoimCreateFormValues } from "@/entities/moim/model/schema";
import { spaceQueries } from "@/entities/spaces";
import { getApi, isAuth } from "@/shared/api/server";
import { ApiError, AuthError, DomainError, ERROR_CODES } from "@/shared/lib/error";

type UpdateMoimParams = {
  meetingId: number;
  data: MoimCreateFormValues;
};

type Deps = {
  getAuthApi?: () => ReturnType<typeof getApi>;
  getSession?: typeof isAuth;
};

export const updateMoim = async (
  { meetingId, data }: UpdateMoimParams,
  { getAuthApi = getApi, getSession = isAuth }: Deps = {},
) => {
  const meetingPayload = {
    name: data.name,
    type: data.type === "study" ? "스터디" : "프로젝트",
    capacity: data.capacity,
    description: data.description,
    image: data.image,
    region: data.location,
    dateTime: new Date(`${data.date}T${data.time}`).toISOString(),
    registrationEnd: new Date(`${data.deadlineDate}T${data.deadlineTime}`).toISOString(),
  };

  const authedApi = await getAuthApi();
  const { userId } = await getSession();

  if (userId == null) {
    throw new AuthError(ERROR_CODES.UNAUTHENTICATED, {
      message: "로그인이 필요합니다.",
    });
  }

  let meetingDetail: { hostId?: number | null } | null = null;

  try {
    const meeting = await authedApi.meetings.getDetail(meetingId);

    meetingDetail =
      meeting && typeof meeting === "object" && "data" in meeting
        ? (meeting.data as { hostId?: number | null } | null)
        : (meeting as { hostId?: number | null } | null);
  } catch (error) {
    throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
      cause: error,
      message: "모임 정보를 불러오지 못했습니다.",
    });
  }

  if (!meetingDetail || meetingDetail.hostId !== userId) {
    throw new DomainError(ERROR_CODES.FORBIDDEN, {
      message: "수정 권한이 없습니다.",
    });
  }

  const res = await authedApi.meetings.update(meetingId, meetingPayload);

  if (!res.ok) {
    throw new ApiError(ERROR_CODES.REQUEST_FAILED, {
      details: res,
      message: "모임 수정에 실패했습니다.",
    });
  }

  await spaceQueries.updateByMeetingId(meetingId, {
    location: data.location,
    themeColor: data.themeColor,
    modules: data.options ?? [],
  });

  return {
    meeting: res.data,
  };
};
