"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Search } from "@moum-zip/ui/icons";
import type { FormEvent } from "react";

import { cn } from "@/shared/lib/cn";

type SearchKeywordStatus = "idle" | "loading" | "success" | "error";

interface SearchKeywordBarProps {
  className?: string;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSubmit: () => void;
  searchStatus: SearchKeywordStatus;
  variant: "hero" | "toolbar";
}

interface SearchKeywordStatusIconProps {
  className?: string;
  searchStatus: SearchKeywordStatus;
}

const SearchKeywordStatusIcon = ({ className, searchStatus }: SearchKeywordStatusIconProps) => {
  if (searchStatus === "idle") {
    return null;
  }

  if (searchStatus === "loading") {
    return <LoaderCircle aria-hidden="true" className={cn("animate-spin text-slate-400", className)} />;
  }

  if (searchStatus === "error") {
    return <CircleAlert aria-hidden="true" className={cn("text-red-500", className)} />;
  }

  return <CircleCheck aria-hidden="true" className={cn("text-primary", className)} />;
};

export const SearchKeywordBar = ({
  className,
  keyword,
  onKeywordChange,
  onSubmit,
  searchStatus,
  variant,
}: SearchKeywordBarProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  if (variant === "hero") {
    return (
      <form className={cn("w-[31rem] min-w-80 max-w-full", className)} onSubmit={handleSubmit}>
        <div className="group flex h-12 min-w-60 items-center rounded-full border border-white/80 bg-white/95 p-1.5 shadow-[0_12px_32px_rgba(31,95,76,0.12)] backdrop-blur-sm transition-all focus-within:ring-4 focus-within:ring-white/35">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
            <Search className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-primary" />
            <input
              aria-label="스페이스 검색어 입력"
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-slate-400"
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="모임명, 설명, 카테고리, 종류 검색"
              type="text"
              value={keyword}
            />
            <SearchKeywordStatusIcon className="h-5 w-5 shrink-0" searchStatus={searchStatus} />
          </div>

          <button
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 font-semibold text-sm text-white transition-colors hover:bg-green-600 lg:h-9.5 lg:w-22 lg:px-7 lg:text-base"
            type="submit"
          >
            검색
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={cn("w-full min-w-80 sm:min-w-0", className)} onSubmit={handleSubmit}>
      <div className="group flex min-w-80 items-center rounded-full border border-slate-200 bg-white/95 p-1 shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-primary" />
          <input
            aria-label="스페이스 검색어 입력"
            className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-slate-400 sm:text-sm"
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="모임 검색"
            type="text"
            value={keyword}
          />
          <SearchKeywordStatusIcon className="h-4 w-4 shrink-0" searchStatus={searchStatus} />
        </div>

        <button
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-3.5 font-semibold text-sm text-white transition-colors hover:bg-green-600"
          type="submit"
        >
          검색
        </button>
      </div>
    </form>
  );
};
