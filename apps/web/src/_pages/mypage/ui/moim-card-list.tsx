import { Empty } from "@ui/components";
import type { MoimCardMockData } from "../mock-data";
import MoimCard from "./moim-card";

interface MoimCardListProps {
  moims: MoimCardMockData[];
  emptyLabel?: string;
}

export default function MoimCardList({ moims, emptyLabel = "아직 신청한 모임이 없어요" }: MoimCardListProps) {
  if (moims.length === 0) {
    return (
      <div className="flex min-h-[22rem] w-full items-center justify-center md:min-h-[20rem] xl:min-h-[24rem]">
        <div className="md:hidden">
          <Empty label={emptyLabel} size="small" />
        </div>
        <div className="hidden md:block">
          <Empty label={emptyLabel} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6">
      {moims.map((moim) => (
        <MoimCard key={moim.id} moim={moim} />
      ))}
    </div>
  );
}
