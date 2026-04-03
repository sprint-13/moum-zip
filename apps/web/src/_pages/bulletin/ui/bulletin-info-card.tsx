import { SpaceCard } from "@/features/space";
import { getBulletinStatsUseCase } from "@/features/space/use-cases/get-bulletin-stats";

interface BulletinInfoCardProps {
  spaceId: string;
  memberCount: number;
}

export const BulletinInfoCard = async ({ spaceId, memberCount }: BulletinInfoCardProps) => {
  const { total, todayCount } = await getBulletinStatsUseCase(spaceId);

  return (
    <SpaceCard>
      <h3 className="font-semibold text-lg text-neutral-500">게시판 정보</h3>
      <div className="mt-4 flex justify-around">
        <div>
          <p className="font-bold text-lg">{total}</p>
          <p className="text-neutral-400 text-sm">게시물 수</p>
        </div>

        <div>
          <p className="font-bold text-lg">{todayCount}</p>
          <p className="text-neutral-400 text-sm">오늘 새 글</p>
        </div>

        <div>
          <p className="font-bold text-lg">{memberCount}명</p>
          <p className="text-neutral-400 text-sm">참여 멤버</p>
        </div>
      </div>
    </SpaceCard>
  );
};
