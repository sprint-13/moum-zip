"use client";

import type { FavoriteList } from "@moum-zip/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSpaceSlugAction } from "../actions";
import type { CreatedFilterKey, MypageMoimCard, MypageProfile, MypageTabKey } from "../model";
import { getCreatedMeetingsQueryOptions, getFavoritesQueryOptions, getJoinedMeetingsQueryOptions } from "../queries";
import { applyFavoriteState, buildFavoriteMeetingIds, buildLikedMeetings, useToggleFavorite } from "../use-cases";
import MoimCardList from "./moim-card-list";
import ProfileSection from "./profile-section";

type MoimTabKey = Exclude<MypageTabKey, "created">;

const createdMoimFilters: Array<{ key: CreatedFilterKey; label: string }> = [
  { key: "ongoing", label: "진행 중" },
  { key: "ended", label: "진행 종료" },
];

interface MypagePageProps {
  initialFavoriteList: FavoriteList;
  profile: MypageProfile;
  tabs: Array<{ key: MypageTabKey; label: string }>;
  moims: Record<MoimTabKey, MypageMoimCard[]>;
  createdMoims: Record<CreatedFilterKey, MypageMoimCard[]>;
  enableRemoteFetch?: boolean;
}

export default function MypageView({
  initialFavoriteList,
  profile,
  tabs,
  moims,
  createdMoims,
  enableRemoteFetch = true,
}: MypagePageProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<MypageTabKey>("joined");
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterKey>("ongoing");
  const favoriteMutation = useToggleFavorite(enableRemoteFetch);

  const {
    data: joinedMeetingCards = moims.joined,
    isError: isJoinedError,
    refetch: refetchJoinedMeetings,
  } = useQuery({
    ...getJoinedMeetingsQueryOptions(moims.joined),
    enabled: enableRemoteFetch && selectedTab === "joined",
  });

  const {
    data: createdMeetingCards = createdMoims[createdFilter],
    isError: isCreatedError,
    refetch: refetchCreatedMeetings,
  } = useQuery({
    ...getCreatedMeetingsQueryOptions(createdFilter),
    enabled: enableRemoteFetch && selectedTab === "created",
  });

  const {
    data: favoriteList,
    isError: isLikedError,
    refetch: refetchLikedMeetings,
  } = useQuery({
    ...getFavoritesQueryOptions(initialFavoriteList),
    enabled: enableRemoteFetch,
  });

  const favoriteMeetingIds = useMemo(
    () => buildFavoriteMeetingIds(enableRemoteFetch ? favoriteList : undefined, moims.liked),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const joinedMeetings = useMemo(
    () => applyFavoriteState(joinedMeetingCards, favoriteMeetingIds),
    [favoriteMeetingIds, joinedMeetingCards],
  );
  const createdMeetings = useMemo(
    () => applyFavoriteState(createdMeetingCards, favoriteMeetingIds),
    [createdMeetingCards, favoriteMeetingIds],
  );
  const likedMeetings = useMemo(
    () => buildLikedMeetings(enableRemoteFetch ? favoriteList : undefined, moims.liked, enableRemoteFetch),
    [enableRemoteFetch, favoriteList, moims.liked],
  );

  const findMeetingById = (meetingId: string) => {
    return (
      joinedMeetings.find((meeting) => meeting.id === meetingId) ??
      createdMeetings.find((meeting) => meeting.id === meetingId) ??
      likedMeetings.find((meeting) => meeting.id === meetingId)
    );
  };

  const handleToggleLike = (meetingId: string) => {
    if (!enableRemoteFetch) {
      return;
    }

    const meeting = findMeetingById(meetingId);

    if (!meeting) {
      return;
    }

    favoriteMutation.mutate({
      meetingId: Number(meetingId),
      nextLiked: !meeting.liked,
    });
  };

  const handleEnterSpace = async (meetingId: string) => {
    // 클릭 시 meetingId에 연결된 space slug를 찾아 스페이스 메인으로 이동합니다.
    const result = await getSpaceSlugAction(Number(meetingId));

    if (!result.ok) {
      return;
    }

    router.push(`/${result.slug}`);
  };

  return (
    <main className="no-scrollbar h-dvh overflow-y-auto bg-background px-4 py-8 text-foreground md:px-9 md:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-[80rem]">
        <section className="grid gap-8 xl:grid-cols-[17.625rem_59.875rem] xl:items-start xl:gap-10">
          <div className="space-y-8 xl:pt-4">
            <h1 className="font-bold text-[2rem] text-foreground leading-none tracking-[-0.03em]">마이페이지</h1>
            <div className="xl:pt-4">
              <ProfileSection profile={profile} />
            </div>
          </div>

          <Tabs
            defaultTab="joined"
            size="large"
            className="w-full min-w-0"
            onTabChange={(tab) => setSelectedTab(tab as MypageTabKey)}
          >
            <Tabs.List className="no-scrollbar w-full min-w-0 overflow-x-auto">
              {tabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.key}
                  value={tab.key}
                  className="shrink-0 px-4 py-3 text-lg md:px-8 md:py-4 md:text-xl xl:px-10 xl:py-4 xl:text-xl"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="pt-8">
              <Tabs.Content value="joined">
                <MoimCardList
                  moims={joinedMeetings}
                  emptyLabel="아직 신청한 모임이 없어요"
                  isError={isJoinedError}
                  onRetry={() => void refetchJoinedMeetings()}
                  onToggleLike={handleToggleLike}
                  onEnterSpace={handleEnterSpace}
                />
              </Tabs.Content>

              <Tabs.Content value="created">
                <div className="space-y-8">
                  <div className="flex items-center gap-2">
                    {createdMoimFilters.map((filter) => {
                      const isSelected = createdFilter === filter.key;

                      return (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() => setCreatedFilter(filter.key)}
                          className={cn(
                            "inline-flex h-10 min-w-20 items-center justify-center rounded-2xl px-4 font-semibold text-sm transition-colors",
                            isSelected ? "bg-slate-800 text-white" : "bg-gray-100 text-slate-800",
                          )}
                          aria-pressed={isSelected}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>

                  <MoimCardList
                    moims={createdMeetings}
                    emptyLabel={
                      createdFilter === "ongoing" ? "아직 진행 중인 모임이 없어요" : "아직 진행 종료된 모임이 없어요"
                    }
                    isError={isCreatedError}
                    onRetry={() => void refetchCreatedMeetings()}
                    onToggleLike={handleToggleLike}
                    onEnterSpace={handleEnterSpace}
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="liked">
                <MoimCardList
                  moims={likedMeetings}
                  emptyLabel="아직 찜한 모임이 없어요"
                  isError={isLikedError}
                  onRetry={() => void refetchLikedMeetings()}
                  onToggleLike={handleToggleLike}
                  onEnterSpace={handleEnterSpace}
                />
              </Tabs.Content>
            </div>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
