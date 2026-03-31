import { SpaceCard } from "@/features/space";

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
] as const;

export const PostCategoryGuideCard = () => {
  return (
    <SpaceCard>
      <h3 className="mb-4 font-bold text-base text-neutral-900">카테고리 안내</h3>
      <ul className="flex flex-col gap-3">
        {CATEGORY_GUIDE.map(({ label, color, description }) => (
          <li key={label} className="flex flex-col gap-1">
            <span className={`w-fit rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${color}`}>{label}</span>
            <p className="text-[13px] text-neutral-500 leading-relaxed">{description}</p>
          </li>
        ))}
      </ul>
    </SpaceCard>
  );
};
