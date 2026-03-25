import { SpaceCard } from "@/features/space/ui/space-card";

export const BulletinInfoCard = () => {
  return (
    <SpaceCard>
      <h3 className="font-bold text-lg">게시판 정보</h3>
      <div className="mt-2 mb-2 text-neutral-600 text-sm">
        <ul className="flex flex-col gap-1">
          <li>
            <strong>공지사항</strong> <br /> 중요한 공지나 업데이트를 공유하는 공간입니다.
          </li>
          <li>
            <strong>토론</strong> <br />
            주제에 대한 의견을 나누고 토론하는 공간입니다.
          </li>
          <li>
            <strong>질문</strong> <br />
            질문을 올리고 답변을 받을 수 있는 공간입니다.
          </li>
          <li>
            <strong>자료</strong> <br /> 유용한 자료나 링크를 공유하는 공간입니다.
          </li>
        </ul>
      </div>
      <div className="flex justify-around">
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
