import { after } from "next/server";
import { Suspense } from "react";
import { postQueries } from "@/entities/post/queries";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getPostDetailUseCase } from "@/features/space/use-cases/get-post-detail";
import { safe } from "@/shared/lib/safe";
import { CommentSection } from "./_components/comment-section";
import { PostArticleSection } from "./_components/post-article-section";
import { PostInfoSection } from "./_components/post-info-section";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ "space-slug": string; "post-id": string }>;
}) {
  const { "space-slug": slug, "post-id": postId } = await params;

  const { membership } = await getSpaceContext(slug);
  // TODO: 이거 지우고 title, author는 url query로 받기.
  const { post } = await safe(getPostDetailUseCase(postId));

  after(async () => {
    await postQueries.incrementViewCount(postId);
  });

  return (
    <>
      <SpaceHeader title={post.title} description={post.author.name} />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<PostArticleSkeleton />}>
            <PostArticleSection
              postId={postId}
              slug={slug}
              currentUserId={membership.userId}
              currentUserRole={membership.role}
            />
          </Suspense>
          <Suspense fallback={<CommentSkeleton />}>
            <CommentSection
              postId={postId}
              slug={slug}
              currentUserId={membership.userId}
              currentUserRole={membership.role}
            />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <Suspense fallback={<PostInfoSkeleton />}>
            <PostInfoSection postId={postId} />
          </Suspense>
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}

function PostArticleSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 rounded-xl border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="h-8 w-3/4 rounded bg-muted" />
      <div className="flex items-center gap-2 border-border border-b pb-4">
        <div className="h-8 w-8 rounded-full bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
      <div className="flex min-h-[200px] flex-col gap-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl border border-border bg-background p-6">
      <div className="h-5 w-16 rounded bg-muted" />
      {Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        <div key={i} className="flex flex-col gap-2 border-border border-b py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function PostInfoSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-1 h-5 w-20 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="mt-2 flex justify-around border-border border-t pt-3">
        <div className="h-4 w-8 rounded bg-muted" />
        <div className="h-4 w-8 rounded bg-muted" />
        <div className="h-4 w-8 rounded bg-muted" />
      </div>
    </div>
  );
}
