import { after } from "next/server";
import { PostDetail } from "@/_pages/bulletin/ui/post-detail";
import { postQueries } from "@/entities/post/queries";
import { SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";
import { safe } from "@/shared/lib/safe";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ "space-slug": string; "post-id": string }>;
}) {
  const { "space-slug": slug, "post-id": postId } = await params;

  const { membership } = await getSpaceContext(slug);

  const { post, comments } = await safe(getPostDetailUseCase(postId));

  after(async () => {
    await postQueries.incrementViewCount(postId);
  });

  return (
    <>
      <SpaceHeader title={post.title} description={post.author.name} />
      <PostDetail
        post={post}
        comments={comments}
        slug={slug}
        currentUserId={membership.userId}
        currentUserRole={membership.role}
      />
    </>
  );
}
