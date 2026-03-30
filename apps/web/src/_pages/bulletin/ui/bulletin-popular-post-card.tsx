import { SpaceCard } from "@/features/space";

export const BulletinPopularPostCard = () => {
  return (
    <SpaceCard>
      <h2 className="mb-4 font-bold text-[18px] text-neutral-400">인기 게시글</h2>
      <div className="flex flex-col gap-5">
        <PopularPost rank={1} title="4주차 자료 업로드 완료" likes={24} />
        <PopularPost rank={2} title="Exam Sprint Checklist" likes={31} />
        <PopularPost rank={3} title="Transformer Reading Notes" likes={17} />
      </div>
    </SpaceCard>
  );
};

function PopularPost({ rank, title, likes }: { rank: number; title: string; likes: number }) {
  return (
    <div className="group flex cursor-pointer items-start gap-3">
      {/* 순위 동그라미 */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-[14px] text-white">
        {rank}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-1 font-semibold text-[15px] text-neutral-900 transition-colors group-hover:text-emerald-600">
          {title}
        </h3>
        <p className="font-medium text-[12px] text-neutral-400">좋아요 {likes}</p>
      </div>
    </div>
  );
}
