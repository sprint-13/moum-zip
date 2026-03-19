"use client";

import { Tabs } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import { createdMoimMockData, mypageMoimMockData, mypageTabs, profileMockData } from "./mock-data";
import MoimCardList from "./ui/moim-card-list";
import ProfileSection from "./ui/profile-section";

type CreatedFilterKey = "ongoing" | "ended";

const createdMoimFilters: Array<{ key: CreatedFilterKey; label: string }> = [
  { key: "ongoing", label: "진행 중" },
  { key: "ended", label: "진행 종료" },
];

export default function MypagePage() {
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterKey>("ongoing");

  return (
    <main className="no-scrollbar h-dvh overflow-y-auto bg-background px-4 py-8 text-foreground sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-[80rem]">
        <section className="grid gap-8 xl:grid-cols-[17.625rem_59.875rem] xl:items-start xl:gap-10">
          <div className="space-y-8 xl:pt-4">
            <h1 className="font-bold text-[2rem] text-foreground leading-none tracking-[-0.03em]">마이페이지</h1>
            <div className="xl:pt-4">
              <ProfileSection profile={profileMockData} />
            </div>
          </div>

          <Tabs defaultTab="joined" size="large" className="w-full min-w-0">
            <Tabs.List className="no-scrollbar w-full min-w-0 overflow-x-auto">
              {mypageTabs.map((tab) => (
                <Tabs.Trigger key={tab.key} value={tab.key} className="shrink-0">
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="pt-8">
              <Tabs.Content value="joined">
                <MoimCardList moims={mypageMoimMockData.joined} />
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

                  <MoimCardList moims={createdMoimMockData[createdFilter]} />
                </div>
              </Tabs.Content>

              <Tabs.Content value="liked">
                <MoimCardList moims={mypageMoimMockData.liked} />
              </Tabs.Content>
            </div>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
