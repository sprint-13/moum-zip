import type { SpaceInfo } from "@/entities/spaces";
import { getApi } from "@/shared/api/server";
import { getSpaceBySlugQuery } from "@/shared/db/queries";
import { safe } from "@/shared/lib/safe";

export const getSpaceInfoUseCase = async (slug: string): Promise<SpaceInfo> => {
  const dbSpace = await safe(getSpaceBySlugQuery(slug), {
    default: (err) => {
      throw new Error("space by slug query error", { cause: err });
    },
  });
  const api = await getApi();

  const { data: apiSpace } = await safe(api.meetings.getDetail(dbSpace.meetingId), {
    default: (err) => {
      throw Error("Failed to verify space access", { cause: err });
    },
  });

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
    capacity: apiSpace.capacity,
  };
};
