"use client";

import { useQuery } from "@tanstack/react-query";
import type { MypageMoimCard } from "../model";
import { getCreatedMeetingCards } from "../use-cases";

interface UseCreatedMeetingsInitialData {
  ended: MypageMoimCard[];
  ongoing: MypageMoimCard[];
}

export const useCreatedMeetings = (initialData: UseCreatedMeetingsInitialData, enabled: boolean) => {
  return useQuery({
    queryKey: ["mypage", "meetings", "created"],
    queryFn: () => getCreatedMeetingCards(),
    initialData,
    staleTime: 0,
    enabled,
  });
};
