import { PostArticle } from "@/_pages/bulletin/ui/post-article";
import type { Requester } from "@/features/space/lib/assert-permission";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";

interface PostArticleSectionProps {
  postId: string;
  slug: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

export const PostArticleSection = async ({ postId, slug, currentUserId, currentUserRole }: PostArticleSectionProps) => {
  const { post } = await getPostDetailUseCase(postId);
  return <PostArticle post={post} slug={slug} currentUserId={currentUserId} currentUserRole={currentUserRole} />;
};
