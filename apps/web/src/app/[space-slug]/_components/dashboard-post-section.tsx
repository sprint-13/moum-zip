import { DashboardPostContent } from "@/_pages/bulletin/ui/dashboard-post-content";
import { getBulletinPostsUseCase } from "@/features/space/use-cases/get-bulletin-posts";

interface DashboardPostSectionProps {
  spaceId: string;
  slug: string;
}

export const DashboardPostSection = async ({ spaceId, slug }: DashboardPostSectionProps) => {
  const bulletinData = await getBulletinPostsUseCase(spaceId);
  return <DashboardPostContent posts={bulletinData.posts} slug={slug} />;
};
