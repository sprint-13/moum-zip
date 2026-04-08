import { after } from "next/server";
import { Suspense } from "react";
import { PostInfoCard } from "@/_pages/bulletin";
import { CommentList } from "@/_pages/bulletin/ui/comment-list";
import { PostArticle } from "@/_pages/bulletin/ui/post-article";
import { postQueries } from "@/entities/post/queries";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ "space-slug": string; "post-id": string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { "space-slug": slug, "post-id": postId } = await params;
  const { title = "", author = "" } = await searchParams;

  const { membership } = await getSpaceContext(slug);

  after(async () => {
    await postQueries.incrementViewCount(postId);
  });

  return (
    <>
      <SpaceHeader
        title={typeof title === "string" ? title : ""}
        description={typeof author === "string" ? author : ""}
      />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<PostArticleSkeleton />}>
            <PostArticle
              postId={postId}
              slug={slug}
              currentUserId={membership.userId}
              currentUserRole={membership.role}
            />
          </Suspense>
          <Suspense fallback={<CommentSkeleton />}>
            <CommentList
              postId={postId}
              slug={slug}
              spaceId={membership.spaceId}
              currentUserId={membership.userId}
              currentUserRole={membership.role}
              currentAuthor={{ id: membership.userId, name: membership.nickname, image: membership.avatarUrl ?? null }}
            />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <Suspense fallback={<PostInfoSkeleton />}>
            <PostInfoCard postId={postId} spaceId={membership.spaceId} />
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
