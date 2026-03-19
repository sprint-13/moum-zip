import type { MoimCardMockData } from "../mock-data";
import MoimCard from "./moin-card";

interface MoimCardListProps {
  moims: MoimCardMockData[];
}

export default function MoimCardList({ moims }: MoimCardListProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      {moims.map((moim) => (
        <MoimCard key={moim.id} moim={moim} />
      ))}
    </div>
  );
}
