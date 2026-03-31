import { PostCategoryGuideCard, PostWritingTipsCard } from "@/_pages/bulletin";
import { PostWriteForm } from "@/_pages/bulletin/ui/post-write-form";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";

export default async function BulletinWritePage({ params }: { params: Promise<{ "space-slug": string }> }) {
  const slug = (await params)["space-slug"];

  return (
    <>
      <SpaceHeader title="새 게시글" description="스터디 커뮤니티에 게시글을 작성하세요." />
      <SpaceBody>
        <SpaceBodyLeft>
          <PostWriteForm slug={slug} />
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
