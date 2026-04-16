import "server-only";

import type { Metadata } from "next";
import {
  buildSearchHref,
  parseSearchQueryState,
  SEARCH_QUERY_PARAM_KEYS,
} from "@/features/space-search/model/search-params";
import { ROUTES } from "@/shared/config/routes";

export type SearchMetadataParams = Record<string, string | string[] | undefined>;

const SEARCH_PAGE_TITLE = "맞춤 모임 찾기";
const SEARCH_PAGE_DESCRIPTION =
  "함께 성장할 동료를 찾고 계신가요? 스터디부터 프로젝트까지, 다양한 모임을 조건별로 살펴보고 나에게 딱 맞는 커뮤니티에 참여하세요.";
const ALLOWED_SEARCH_PARAM_KEYS = new Set<string>(SEARCH_QUERY_PARAM_KEYS);

const isDefaultSearchPage = (searchParams: SearchMetadataParams) => {
  for (const [key, value] of Object.entries(searchParams)) {
    if (!ALLOWED_SEARCH_PARAM_KEYS.has(key)) {
      return false;
    }

    if (Array.isArray(value) && value.length > 1) {
      return false;
    }
  }

  const queryState = parseSearchQueryState(searchParams);
  const hasRawQueryEntries = Object.values(searchParams).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined;
  });

  return !hasRawQueryEntries && buildSearchHref(ROUTES.search, queryState) === ROUTES.search;
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
