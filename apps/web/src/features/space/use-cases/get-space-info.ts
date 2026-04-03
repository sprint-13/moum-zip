import { cache } from "react";
import { type SpaceInfo, spaceQueries } from "@/entities/spaces";
import { getApi } from "@/shared/api/server";
import { safe } from "@/shared/lib/safe";

const getCachedMeetingDetail = cache(async (meetingId: number) => {
  const api = await getApi();
  return safe(api.meetings.getDetail(meetingId), {
    default: (err) => {
      throw Error("Failed to verify space access", { cause: err });
    },
  });
});

export const getSpaceInfoUseCase = async (slug: string): Promise<SpaceInfo> => {
  const dbSpace = await safe(spaceQueries.findBySlug(slug), {
    default: (err) => {
      throw new Error("space by slug query error", { cause: err });
    },
  });

  const { data: apiSpace } = await getCachedMeetingDetail(dbSpace.meetingId);

  return {
    spaceId: dbSpace.id,
    slug: dbSpace.slug,
    name: apiSpace.name,
    location: dbSpace.location,
    themeColor: dbSpace.themeColor,
    status: dbSpace.status,
    modules: dbSpace.modules,
    image: apiSpace.image,
    type: apiSpace.type === "study" ? "study" : "project",
    startDate: apiSpace.dateTime,
    capacity: apiSpace.participantCount,
    isApproved: true, // getSpaceContext에서 멤버십 검증 후 호출되므로 항상 승인 상태
  };
};
