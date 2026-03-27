"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import { fetchMyFavorites, fetchMyMeetings } from "./api";
import { mapCreatedMeeting, mapFavoriteMeeting } from "./model/mappers";
import type { CreatedFilterKey, MypageMoimCard, MypageProfile, MypageTabKey } from "./model/types";
import MoimCardList from "./ui/moim-card-list";
import ProfileSection from "./ui/profile-section";

type MoimTabKey = Exclude<MypageTabKey, "created">;

const createdMoimFilters: Array<{ key: CreatedFilterKey; label: string }> = [
  { key: "ongoing", label: "진행 중" },
  { key: "ended", label: "진행 종료" },
];

interface MypagePageProps {
  profile: MypageProfile;
  tabs: Array<{ key: MypageTabKey; label: string }>;
  moims: Record<MoimTabKey, MypageMoimCard[]>;
  createdMoims: Record<CreatedFilterKey, MypageMoimCard[]>;
}

export default function MypagePage({ profile, tabs, moims, createdMoims }: MypagePageProps) {
  const [selectedTab, setSelectedTab] = useState<MypageTabKey>("joined");
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterKey>("ongoing");
  const isCreatedOngoing = createdFilter === "ongoing";

  const { data: createdMeetings = createdMoims[createdFilter] } = useQuery({
    queryKey: ["mypage", "meetings", "created", createdFilter],
    queryFn: async () => {
      const response = await fetchMyMeetings({
        type: "created",
        completed: isCreatedOngoing ? "false" : "true",
        sortBy: "dateTime",
        sortOrder: isCreatedOngoing ? "asc" : "desc",
        size: 10,
      });

      return response.data.map(mapCreatedMeeting);
    },
    enabled: selectedTab === "created",
  });

  const { data: likedMeetings = moims.liked } = useQuery({
    queryKey: ["mypage", "favorites"],
    queryFn: async () => {
      const response = await fetchMyFavorites({
        sortBy: "createdAt",
        sortOrder: "desc",
        size: 10,
      });

      return response.data.map(mapFavoriteMeeting);
    },
    enabled: selectedTab === "liked",
  });

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
                <MoimCardList moims={moims.joined} emptyLabel="아직 신청한 모임이 없어요" />
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
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="liked">
                <MoimCardList moims={likedMeetings} emptyLabel="아직 찜한 모임이 없어요" />
              </Tabs.Content>
            </div>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
