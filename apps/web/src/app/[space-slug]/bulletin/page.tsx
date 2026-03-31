import { Pencil } from "@moum-zip/ui/icons";
import Link from "next/link";
import { Suspense } from "react";
import { BulletinInfoCard, BulletinPopularPostCard, BulletinTable } from "@/_pages/bulletin";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";

export default async function BulletinPage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];

  const WritePostButton = (
    <Link
      href={`/${slug}/bulletin/write`}
      className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
    >
      <Pencil className="size-4" />
      글쓰기
    </Link>
  );

  return (
    <>
      <SpaceHeader
        title="게시판"
        description="공지, 토론 스레드, 학습 게시글을 확인하세요."
        buttonGroup={WritePostButton}
      />
      <SpaceBody>
        <SpaceBodyLeft>
          <Suspense fallback={<BulletinTableSkeleton />}>
            <BulletinTable />
          </Suspense>
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <BulletinInfoCard />
          <BulletinPopularPostCard />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}

function BulletinTableSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 px-3 pb-2">
      <div className="h-12 rounded-t-lg bg-muted" />
      <div className="flex flex-col gap-3 rounded-lg rounded-t-none bg-background p-4 shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={i} className="h-10 rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
