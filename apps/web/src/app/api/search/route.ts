import { NextResponse } from "next/server";

import { getSearchMeetingsApi } from "@/_pages/space-search/lib/get-search-meetings-api";
import { getSearchResults } from "@/_pages/space-search/use-cases/get-search-results";
import { normalizeSearchQueryState, parseSpaceSearchQueryState } from "@/features/space-search/model/search-params";

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
  const queryState = normalizeSearchQueryState(parseSpaceSearchQueryState(searchParams));
  const cursor = searchParams.get("cursor");
  const size = parsePositiveInteger(searchParams.get("size"));
  const { isAuthenticatedRequest, meetingsApi } = await getSearchMeetingsApi();

  const results = await getSearchResults(
    {
      ...queryState,
      cursor,
      size,
    },
    { isAuthenticatedRequest, meetingsApi },
  );

  return NextResponse.json(results);
}
