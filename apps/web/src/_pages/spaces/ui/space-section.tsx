"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { SpaceInfo } from "@/entities/spaces";
import { useSpaceList } from "../hooks/use-space-list";
import { NoSpaceCard } from "./no-space-card";
import { SpaceControl } from "./space-control";
import { SpaceInfoGridCard } from "./space-info-grid-card";

interface SpaceSectionProps {
  className?: string;
}

export const SpaceSection = ({ className }: SpaceSectionProps) => {
  const [activeTab, setActiveTab] = useState<"ongoing" | "archived" | "pending">("ongoing");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSpaceList();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const spaces = useMemo(() => data.pages.flatMap((page) => page.data), [data.pages]);
  const ongoingSpaces = useMemo(
    () => spaces.filter((space) => space.status === "ongoing" && space.isApproved === true),
    [spaces],
  );
  const archivedSpaces = useMemo(() => spaces.filter((space) => space.status === "archived"), [spaces]);
  const pendingSpaces = useMemo(() => spaces.filter((space) => space.isApproved === false), [spaces]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filterByQuery = (space: SpaceInfo) =>
    normalizedQuery.length === 0 || space.name.toLowerCase().includes(normalizedQuery);

  const visibleOngoingSpaces = ongoingSpaces.filter(filterByQuery);
  const visibleArchivedSpaces = archivedSpaces.filter(filterByQuery);
  const visiblePendingSpaces = pendingSpaces.filter(filterByQuery);

  const displaySpaces =
    activeTab === "ongoing"
      ? visibleOngoingSpaces
      : activeTab === "archived"
        ? visibleArchivedSpaces
        : visiblePendingSpaces;

  const isEmpty =
    (activeTab === "ongoing" ? ongoingSpaces : activeTab === "archived" ? archivedSpaces : pendingSpaces).length === 0;
  const isSearchEmpty = displaySpaces.length === 0 && normalizedQuery.length > 0;

  const getEmptyMessage = (): string | null => {
    if (isSearchEmpty) return "검색 결과가 없어요";
    if (!isEmpty) return null;

    return activeTab === "ongoing"
      ? "참여 중인 스페이스가 없어요"
      : activeTab === "archived"
        ? "아카이브된 스페이스가 없어요"
        : "승인 대기 중인 스페이스가 없어요";
  };
  const emptyMessage = getEmptyMessage();

  return (
    <section className={className}>
      <SpaceControl
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        ongoingSpacesNumber={ongoingSpaces.length}
        archivedSpacesNumber={archivedSpaces.length}
        pendingSpaceNumber={pendingSpaces.length}
        query={query}
        onQueryChange={setQuery}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displaySpaces.map((space) => (
          <SpaceInfoGridCard key={space.spaceId} space={space} />
        ))}
        {emptyMessage ? <NoSpaceCard message={emptyMessage} /> : null}
      </div>
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && <div className="py-6 text-center text-muted-foreground text-sm">불러오는 중...</div>}
    </section>
  );
};
