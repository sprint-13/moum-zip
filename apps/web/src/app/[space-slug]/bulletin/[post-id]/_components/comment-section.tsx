import { CommentList } from "@/_pages/bulletin/ui/comment-list";
import type { Requester } from "@/features/space/lib/assert-permission";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";

interface CommentSectionProps {
  postId: string;
  slug: string;
  currentUserId: number;
  currentUserRole: Requester["role"];
}

export const CommentSection = async ({ postId, slug, currentUserId, currentUserRole }: CommentSectionProps) => {
  const { comments } = await getPostDetailUseCase(postId);
  return (
    <CommentList
      comments={comments}
      slug={slug}
      postId={postId}
      currentUserId={currentUserId}
      currentUserRole={currentUserRole}
    />
  );
};
