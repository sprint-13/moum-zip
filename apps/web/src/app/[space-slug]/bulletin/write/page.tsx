import { PostWriteForm } from "@/_pages/bulletin/ui/post-write-form";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceCard, SpaceHeader } from "@/features/space";

const CATEGORY_GUIDE = [
  {
    label: "공지",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    description: "스터디 운영에 관한 중요한 공지사항을 작성하세요.",
  },
  {
    label: "토론",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    description: "자유롭게 의견을 나누고 토론하는 게시글입니다.",
  },
  {
    label: "질문",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    description: "학습 중 궁금한 점을 질문하고 답변을 받아보세요.",
  },
  {
    label: "자료",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    description: "유용한 학습 자료나 링크를 공유하세요.",
  },
];

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
          <SpaceCard>
            <h3 className="mb-4 font-bold text-base text-neutral-900">카테고리 안내</h3>
            <ul className="flex flex-col gap-3">
              {CATEGORY_GUIDE.map(({ label, color, description }) => (
                <li key={label} className="flex flex-col gap-1">
                  <span className={`w-fit rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${color}`}>
                    {label}
                  </span>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">{description}</p>
                </li>
              ))}
            </ul>
          </SpaceCard>

          {/* 작성 팁 */}
          <SpaceCard>
            <h3 className="mb-3 font-bold text-base text-neutral-900">작성 팁</h3>
            <ul className="flex flex-col gap-2">
              {[
                "제목은 내용을 잘 요약해서 작성하세요.",
                "질문 시 문제 상황을 구체적으로 설명하면 더 빠른 답변을 받을 수 있어요.",
                "자료 공유 시 출처를 함께 작성해주세요.",
              ].map((tip) => (
                <li key={tip} className="flex gap-2 text-[13px] text-neutral-500 leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </SpaceCard>
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
