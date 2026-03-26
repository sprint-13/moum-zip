import { NextResponse } from "next/server";

import { getSearchResults } from "@/_pages/space-search/use-cases/get-search-results";
import { normalizeSearchQueryState, parseSpaceSearchQueryState } from "@/features/space-search/model/search-params";
import { getAuthenticatedApi } from "@/shared/api/auth-client";

const parsePositiveInteger = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryState = normalizeSearchQueryState(parseSpaceSearchQueryState(searchParams));
  const cursor = searchParams.get("cursor");
  const size = parsePositiveInteger(searchParams.get("size"));
  const authedApi = await getAuthenticatedApi();
  console.log("[search] source route", { ...queryState, cursor, size });

  const results = await getSearchResults(
    {
      ...queryState,
      cursor,
      size,
    },
    { meetingsApi: authedApi.meetings },
  );

  return NextResponse.json(results);
}
