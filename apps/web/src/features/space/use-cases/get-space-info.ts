import { notFound, redirect } from "next/navigation";
import type { SpaceInfo } from "@/entities/spaces";
import { getAuthenticatedApi } from "@/shared/api/auth-client";
import { getSpaceBySlugQuery } from "@/shared/db/queries";
import { safe } from "@/shared/lib/safe";

export const getSpaceInfoRemote = async (slug: string): Promise<SpaceInfo> => {
  const dbSpace = await safe(getSpaceBySlugQuery(slug), { notFound: () => notFound() });
  const authedApi = await getAuthenticatedApi();

  const { data: apiSpace } = await safe(authedApi.meetings.getDetail(dbSpace.meetingId), {
    401: () => {
      redirect("/login");
    },
    default: () => {
      throw Error("Failed to verify space access");
    },
  });

  return {
    spaceId: dbSpace.id,
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
