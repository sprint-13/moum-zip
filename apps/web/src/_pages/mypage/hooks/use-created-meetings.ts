"use client";

import { useQuery } from "@tanstack/react-query";
import type { CreatedFilterKey, MypageMoimCard } from "../model";
import { getCreatedMeetingCards } from "../use-cases";

export const useCreatedMeetings = (
  createdFilter: CreatedFilterKey,
  initialData: MypageMoimCard[],
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["mypage", "meetings", "created", createdFilter],
    queryFn: () => getCreatedMeetingCards(createdFilter),
    initialData,
    staleTime: 0,
    enabled,
  });
};
