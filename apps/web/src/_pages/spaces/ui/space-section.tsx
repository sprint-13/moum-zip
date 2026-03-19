"use client";
import { useDeferredValue, useState } from "react";

import type { SpaceInfo } from "@/entities/space";
import { NoSpaceCard } from "./no-space-card";
import { SpaceControl } from "./space-control";
import { SpaceInfoGridCard } from "./space-info-grid-card";

interface SpaceSectionProps {
  spaces: SpaceInfo[];
  className?: string;
}

export const SpaceSection = ({ spaces, className }: SpaceSectionProps) => {
  const [activeTab, setActiveTab] = useState<"ongoing" | "archived">("ongoing");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const ongoingSpaces = spaces.filter((space) => space.status === "ongoing");
  const archivedSpaces = spaces.filter((space) => space.status === "archived");

  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filterByQuery = (space: SpaceInfo) =>
    normalizedQuery.length === 0 || space.name.toLowerCase().includes(normalizedQuery);

  const visibleOngoingSpaces = ongoingSpaces.filter(filterByQuery);
  const visibleArchivedSpaces = archivedSpaces.filter(filterByQuery);

  const displaySpaces = activeTab === "ongoing" ? visibleOngoingSpaces : visibleArchivedSpaces;
  const isEmpty = (activeTab === "ongoing" ? ongoingSpaces : archivedSpaces).length === 0;
  const isSearchEmpty = displaySpaces.length === 0 && normalizedQuery.length > 0;

  return (
    <section className={className}>
      <SpaceControl
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        ongoingSpacesNumber={ongoingSpaces.length}
        archivedSpacesNumber={archivedSpaces.length}
        query={query}
        onQueryChange={setQuery}
      />
      <div className={`columns-1 gap-6 md:columns-2 lg:columns-3`}>
        {displaySpaces.map((space) => (
          <SpaceInfoGridCard key={space.id} space={space} />
        ))}
        {isEmpty && <NoSpaceCard message="참여 중인 스페이스가 없어요" />}
        {isSearchEmpty && <NoSpaceCard message="검색 결과가 없어요" />}
      </div>
    </section>
  );
};
