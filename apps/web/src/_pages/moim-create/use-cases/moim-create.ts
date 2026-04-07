import { memberQueries } from "@/entities/member";
import type { MoimCreateFormValues } from "@/entities/moim";
import { spaceQueries } from "@/entities/spaces";
import type { ApiClient } from "@/shared/api";

// 모임 생성 API 호출 후, 로컬 space, 스페이스 멤버(매니저)까지 저장
// API 클라이언트와 userId는 Server Action에서 주입

export type CreateMoimDeps = {
  userId: number;
  meetingsApi: Pick<ApiClient["meetings"], "create">;
  userApi: Pick<ApiClient["user"], "getUser">;
};

export async function createMoim(formData: MoimCreateFormValues, { userId, meetingsApi, userApi }: CreateMoimDeps) {
  const meetingPayload = {
    name: formData.name,
    type: formData.type === "study" ? "스터디" : "프로젝트",
    capacity: formData.capacity,
    description: formData.description,
    image: formData.image,
    region: formData.location,
    dateTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
    registrationEnd: new Date(`${formData.deadlineDate}T${formData.deadlineTime}`).toISOString(),
  };

  const userRes = await userApi.getUser();
  if (!userRes.ok || !userRes.data) throw new Error("유저 정보를 불러오지 못했습니다.");
  const me = userRes.data;

  // 외부 API 호출 - 모임 생성
  const res = await meetingsApi.create(meetingPayload);
  if (!res.ok) throw new Error("모임 생성에 실패했습니다.");
  const meeting = res.data as { id: number };

  // 로컬 DB - SPACE
  const space = await spaceQueries.create({
    id: String(meeting.id),
    slug: String(meeting.id),
    meetingId: meeting.id,
    location: formData.location,
    themeColor: formData.themeColor,
    status: "ongoing",
    modules: formData.options ?? [],
  });

  // 로컬 DB - SPACE 매니저 멤버 등록
  await memberQueries.create({
    id: crypto.randomUUID(),
    spaceId: space.id,
    userId,
    role: "manager",
    nickname: me.name,
    email: me.email,
    avatarUrl: me.image ?? null,
  });

  return { meeting, space };
}
