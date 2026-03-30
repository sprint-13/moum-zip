import { Pencil } from "@moum-zip/ui/icons";
import Link from "next/link";
import { BulletinInfoCard, BulletinPopularPostCard, BulletinTable } from "@/_pages/bulletin";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";
import { getSpaceContext } from "@/features/space/lib/get-space-context";
import { getBulletinPostsUseCase } from "@/features/space/use-cases/get-bulletin-posts";

export default async function BulletinPage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];
  const { space } = await getSpaceContext(slug);
  const { posts } = await getBulletinPostsUseCase(space.spaceId, { page: 1 });

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
          <BulletinTable posts={posts} />
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <BulletinInfoCard />
          <BulletinPopularPostCard />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
