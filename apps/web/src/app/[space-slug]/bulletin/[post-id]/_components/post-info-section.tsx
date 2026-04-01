import { PostInfoCard } from "@/_pages/bulletin/ui/post-info-card";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";

interface PostInfoSectionProps {
  postId: string;
}

export const PostInfoSection = async ({ postId }: PostInfoSectionProps) => {
  const { post } = await getPostDetailUseCase(postId);
  return <PostInfoCard post={post} />;
};
