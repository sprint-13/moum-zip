import { NextResponse } from "next/server";

import { getSearchMeetingsApi } from "@/_pages/space-search/lib/get-search-meetings-api";
import { getSearchResults } from "@/_pages/space-search/use-cases/get-search-results";
import { normalizeSearchQueryState, parseSearchQueryState } from "@/features/space-search/model/search-params";

const MAX_SEARCH_SIZE = 12;

const parsePositiveInteger = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return Math.min(parsed, MAX_SEARCH_SIZE);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryState = normalizeSearchQueryState(parseSearchQueryState(searchParams));
  const cursor = searchParams.get("cursor");
  const size = parsePositiveInteger(searchParams.get("size"));
  let isAuthenticatedRequest = false;

  try {
    const searchMeetingsApi = await getSearchMeetingsApi();
    isAuthenticatedRequest = searchMeetingsApi.isAuthenticatedRequest;

    const results = await getSearchResults(
      {
        ...queryState,
        cursor,
        size,
      },
      { isAuthenticatedRequest, meetingsApi: searchMeetingsApi.meetingsApi },
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("[search] failed to get search results", {
      error,
      isAuthenticatedRequest,
      categoryId: queryState.categoryId,
      hasKeyword: Boolean(queryState.keyword),
      keywordLength: queryState.keyword.length,
      locationId: queryState.locationId,
    });

    return NextResponse.json({ message: "FAILED_TO_GET_SEARCH_RESULTS" }, { status: 502 });
  }
}
