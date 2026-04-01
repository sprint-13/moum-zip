import { SpaceCard } from "@/features/space";

const WRITING_TIPS = [
  "제목은 내용을 잘 요약해서 작성하세요.",
  "질문 시 문제 상황을 구체적으로 설명하면 더 빠른 답변을 받을 수 있어요.",
  "자료 공유 시 출처를 함께 작성해주세요.",
] as const;

export const PostWritingTipsCard = () => {
  return (
    <SpaceCard>
      <h3 className="mb-3 font-bold text-base text-neutral-900">작성 팁</h3>
      <ul className="flex flex-col gap-2">
        {WRITING_TIPS.map((tip) => (
          <li key={tip} className="flex gap-2 text-[13px] text-neutral-500 leading-relaxed">
            <span className="mt-0.5 shrink-0 text-primary">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </SpaceCard>
  );
};
