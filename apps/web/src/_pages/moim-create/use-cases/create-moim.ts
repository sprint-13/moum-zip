import { insertSpace } from "@/entities/space";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";

export async function createMoim(formData: MoimCreateFormValues, accessToken: string) {
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

  // meetings API 호출 → MEETING 생성
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(meetingPayload),
  });

  if (!res.ok) {
    throw new Error("모임 생성에 실패했습니다.");
  }

  const meeting = (await res.json()) as { id: number };

  // 외부 API 응답 meetingId로 SPACE DB 저장
  const space = await insertSpace({
    id: String(meeting.id),
    slug: String(meeting.id),
    meetingId: meeting.id,
    location: formData.location,
    themeColor: formData.themeColor,
    status: "ongoing",
    modules: formData.options ?? [],
  });

  return { meeting, space };
}
