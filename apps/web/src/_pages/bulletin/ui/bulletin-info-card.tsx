import { SpaceCard } from "@/features/space";

export const BulletinInfoCard = () => {
  return (
    <SpaceCard>
      <h3 className="font-semibold text-lg text-neutral-500">게시판 정보</h3>
      <div className="mt-4 flex justify-around">
        <div>
          <p className="font-bold text-lg">123</p>
          <p className="text-neutral-400 text-sm">게시물 수</p>
        </div>

        <div>
          <p className="font-bold text-lg">2</p>
          <p className="text-neutral-400 text-sm">오늘 새 글</p>
        </div>

        <div>
          <p className="font-bold text-lg">23명</p>
          <p className="text-neutral-400 text-sm">참여 멤버</p>
        </div>
      </div>
    </SpaceCard>
  );
};
