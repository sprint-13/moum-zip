import "server-only";

import type { Metadata } from "next";
import { buildSearchHref, parseSearchQueryState } from "@/features/space-search";
import { ROUTES } from "@/shared/config/routes";

export type SearchMetadataParams = Record<string, string | string[] | undefined>;

const SEARCH_PAGE_TITLE = "모임 찾기";
const SEARCH_PAGE_DESCRIPTION = "관심 있는 모임을 조건별로 살펴보고 참여할 모임을 찾아보세요.";

const isDefaultSearchPage = (searchParams: SearchMetadataParams) => {
  const queryState = parseSearchQueryState(searchParams);

  return buildSearchHref(ROUTES.search, queryState) === ROUTES.search;
};

export const getSearchMetadata = async (
  searchParams?: Promise<SearchMetadataParams> | SearchMetadataParams,
): Promise<Metadata> => {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isIndexable = isDefaultSearchPage(resolvedSearchParams);

  return {
    title: SEARCH_PAGE_TITLE,
    description: SEARCH_PAGE_DESCRIPTION,
    alternates: {
      canonical: ROUTES.search,
    },
    robots: isIndexable
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      title: SEARCH_PAGE_TITLE,
      description: SEARCH_PAGE_DESCRIPTION,
      url: ROUTES.search,
      type: "website",
    },
  };
};
