import { Button, Empty } from "@ui/components";
import type { ReactNode } from "react";
import type { MypageMoimCard } from "@/_pages/mypage/model/types";
import { MoimCard } from "@/_pages/mypage/ui/moim-card";

interface MoimCardListProps {
  moims: MypageMoimCard[];
  emptyLabel?: string;
  isError?: boolean;
  onRetry?: () => void;
  onToggleLike?: (meetingId: string) => void;
  onEnterSpace?: (meetingId: string) => void;
  showActionButton?: boolean;
  canShowActionButton?: (moim: MypageMoimCard) => boolean;
}

interface ListStatusContainerProps {
  children: ReactNode;
}

const ListStatusContainer = ({ children }: ListStatusContainerProps) => {
  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center md:min-h-[20rem] xl:min-h-[24rem]">
      {children}
    </div>
  );
};

export const MoimCardList = ({
  moims,
  emptyLabel = "아직 신청한 모임이 없어요",
  isError = false,
  onRetry,
  onToggleLike,
  onEnterSpace,
  showActionButton = true,
  canShowActionButton,
}: MoimCardListProps) => {
  if (moims.length > 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        {moims.map((moim) => (
          <MoimCard
            key={moim.id}
            moim={moim}
            onToggleLike={onToggleLike}
            onEnterSpace={onEnterSpace}
            showActionButton={canShowActionButton ? canShowActionButton(moim) : showActionButton}
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ListStatusContainer>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-medium text-muted-foreground text-sm md:text-base">
            목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
          {onRetry ? (
            <Button type="button" variant="secondary" size="small" onClick={onRetry}>
              다시 시도
            </Button>
          ) : null}
        </div>
      </ListStatusContainer>
    );
  }

  return (
    <ListStatusContainer>
      <div className="md:hidden">
        <Empty label={emptyLabel} size="small" />
      </div>
      <div className="hidden md:block">
        <Empty label={emptyLabel} />
      </div>
    </ListStatusContainer>
  );
};
