import { notFound } from "next/navigation";
import { PostDetail } from "@/_pages/bulletin/ui/post-detail";
import { SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ "space-slug": string; "post-id": string }>;
}) {
  const { "space-slug": slug, "post-id": postId } = await params;

  const { membership } = await getSpaceContext(slug);

  let result: Awaited<ReturnType<typeof getPostDetailUseCase>>;
  try {
    result = await getPostDetailUseCase(postId);
  } catch {
    notFound();
  }

  const { post, comments } = result;

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
