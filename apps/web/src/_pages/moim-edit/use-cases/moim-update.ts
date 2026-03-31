import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { getApi, isAuth } from "@/shared/api/server";

type UpdateMoimParams = {
  meetingId: number;
  data: MoimCreateFormValues;
};

type Deps = {
  getAuthApi?: () => ReturnType<typeof getApi>;
};

export async function updateMoim({ meetingId, data }: UpdateMoimParams, { getAuthApi = getApi }: Deps = {}) {
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
  const { userId } = await isAuth();

  if (userId == null) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await authedApi.meetings.update(meetingId, meetingPayload);

  if (!res.ok) {
    throw new Error("모임 수정에 실패했습니다.");
  }

  return {
    meeting: res.data,
  };
}
