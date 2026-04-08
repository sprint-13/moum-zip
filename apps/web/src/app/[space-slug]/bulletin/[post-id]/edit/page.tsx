import { notFound } from "next/navigation";
import { PostCategoryGuideCard, PostWritingTipsCard } from "@/_pages/bulletin";
import { PostWriteForm } from "@/_pages/bulletin/ui/post-write-form";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getPostInfo } from "@/features/space/use-cases/get-post-detail";
import { handleAppError } from "@/shared/lib/handle-app-error";

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ "space-slug": string; "post-id": string }>;
}) {
  const { "space-slug": slug, "post-id": postId } = await params;

  const { space, membership } = await getSpaceContext(slug);

  const post = await getPostInfo(postId, space.spaceId).catch(handleAppError);

  const canEdit = membership.userId === post.authorId || membership.role === "manager";
  if (!canEdit) notFound();

  return (
    <>
      <SpaceHeader title="게시글 수정" description={post.author.name} />
      <SpaceBody>
        <SpaceBodyLeft>
          <PostWriteForm
            slug={slug}
            initialPost={{ id: post.id, title: post.title, content: post.content, category: post.category }}
          />
        </SpaceBodyLeft>

        <SpaceBodyRight>
          {/* 카테고리 안내 */}
          <PostCategoryGuideCard />
          {/* 작성 팁 */}
          <PostWritingTipsCard />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
