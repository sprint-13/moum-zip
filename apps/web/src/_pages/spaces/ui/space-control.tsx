"use client";

import { Search } from "@moum-zip/ui/icons";

interface SpaceControlProps {
  activeTab: "ongoing" | "archived" | "pending";
  onTabChange: (tab: "ongoing" | "archived" | "pending") => void;
  ongoingSpacesNumber: number;
  archivedSpacesNumber: number;
  pendingSpaceNumber: number;
  query: string;
  onQueryChange: (query: string) => void;
}

export const SpaceControl = ({
  activeTab,
  onTabChange,
  ongoingSpacesNumber,
  archivedSpacesNumber,
  pendingSpaceNumber,
  query,
  onQueryChange,
}: SpaceControlProps) => {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex w-full rounded-2xl bg-slate-200/40 p-1.5 md:w-auto">
        <button
          type="button"
          onClick={() => onTabChange("ongoing")}
          data-active={activeTab === "ongoing"}
          className={`flex-1 rounded-xl px-8 py-2.5 font-bold text-sm transition-all data-[active=true]:bg-white data-[active=false]:text-slate-500 data-[active=true]:text-primary data-[active=true]:shadow-md data-[active=false]:hover:text-slate-700 md:flex-none`}
        >
          진행 중 <span className="ml-1 font-medium opacity-50">{ongoingSpacesNumber}</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("archived")}
          data-active={activeTab === "archived"}
          aria-pressed={activeTab === "archived"}
          className={`flex-1 rounded-xl px-8 py-2.5 font-bold text-sm transition-all data-[active=true]:bg-white data-[active=false]:text-slate-500 data-[active=true]:text-primary data-[active=true]:shadow-md data-[active=false]:hover:text-slate-700 md:flex-none`}
        >
          아카이브 <span className="ml-1 font-medium opacity-50">{archivedSpacesNumber}</span>
        </button>{" "}
        <button
          type="button"
          onClick={() => onTabChange("pending")}
          data-active={activeTab === "pending"}
          aria-pressed={activeTab === "pending"}
          className={`flex-1 rounded-xl px-8 py-2.5 font-bold text-sm transition-all data-[active=true]:bg-white data-[active=false]:text-slate-500 data-[active=true]:text-primary data-[active=true]:shadow-md data-[active=false]:hover:text-slate-700 md:flex-none`}
        >
          승인 대기중 <span className="ml-1 font-medium opacity-50">{pendingSpaceNumber}</span>
        </button>
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto">
        <div className="group relative flex-1 md:w-72">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00bd7e]" />
          <input
            type="text"
            aria-label="스페이스 이름 검색"
            placeholder="스페이스 이름 검색"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm shadow-sm transition-all focus:border-[#00bd7e] focus:outline-none focus:ring-4 focus:ring-[#00bd7e]/10"
          />
        </div>
      </div>
    </div>
  );
};
