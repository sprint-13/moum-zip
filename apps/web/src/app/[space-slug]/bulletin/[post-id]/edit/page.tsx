import { notFound } from "next/navigation";
import { PostWriteForm } from "@/_pages/bulletin/ui/post-write-form";
import { SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";

export default async function PostEditPage({
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

  const { post } = result;
  const canEdit = membership.userId === post.authorId || membership.role === "manager";
  if (!canEdit) notFound();

  return (
    <>
      <SpaceHeader title="게시글 수정" description={post.author.name} />
      <PostWriteForm
        slug={slug}
        initialPost={{ id: post.id, title: post.title, content: post.content, category: post.category }}
      />
    </>
  );
}
