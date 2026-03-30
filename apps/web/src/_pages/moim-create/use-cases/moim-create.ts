import { memberQueries } from "@/entities/member";
import { spaceQueries } from "@/entities/spaces";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { getApi, isAuth } from "@/shared/api/server";

type Deps = {
  getAuthApi?: () => ReturnType<typeof getApi>;
};

export async function createMoim(formData: MoimCreateFormValues, { getAuthApi = getApi }: Deps = {}) {
  const meetingPayload = {
    name: formData.name,
    type: formData.type === "study" ? "스터디" : "프로젝트",
    capacity: formData.capacity,
    description: formData.description,
    image: formData.image,
    region: formData.location,
    dateTime: new Date(`${formData.date}T${formData.time}`).toISOString(), // date + time
    registrationEnd: new Date(`${formData.deadlineDate}T${formData.deadlineTime}`).toISOString(), // deadlineDate
  };

  // 인증
  const authedApi = await getAuthApi();
  const { userId } = await isAuth();
  if (userId == null) throw new Error("로그인이 필요합니다.");

  const userRes = await authedApi.user.getUser();
  if (!userRes.ok || !userRes.data) throw new Error("유저 정보를 불러오지 못했습니다.");
  const me = userRes.data;

  // 외부 API 호출 → MEETING 생성
  const res = await authedApi.meetings.create(meetingPayload);
  if (!res.ok) throw new Error("모임 생성에 실패했습니다.");
  const meeting = res.data as { id: number };

  // SPACE DB 저장
  const space = await spaceQueries.create({
    id: String(meeting.id),
    slug: String(meeting.id),
    meetingId: meeting.id,
    location: formData.location,
    themeColor: formData.themeColor,
    status: "ongoing",
    modules: formData.options ?? [],
  });

  // 스페이스 멤버 등록
  await memberQueries.create({
    spaceId: space.id,
    userId,
    role: "manager",
    nickname: me.name,
    email: me.email,
    avatarUrl: me.image,
  });

  return { meeting, space };
}
