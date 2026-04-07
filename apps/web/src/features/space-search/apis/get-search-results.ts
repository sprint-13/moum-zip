import type { SearchResultsResponse } from "@/entities/gathering";

import type { SearchRequestQueryState } from "../model/types";

interface GetSearchResultsRequest extends SearchRequestQueryState {
  cursor?: string | null;
  size?: number;
}

export const getSearchResults = async ({
  categoryId,
  cursor,
  dateSortId,
  deadlineSortId,
  locationId,
  size,
}: GetSearchResultsRequest): Promise<SearchResultsResponse> => {
  const searchParams = new URLSearchParams();

  if (categoryId !== "all") {
    searchParams.set("category", categoryId);
  }

  if (dateSortId !== "default") {
    searchParams.set("dateSort", dateSortId);
  }

  if (locationId !== "all") {
    searchParams.set("location", locationId);
  }

  if (deadlineSortId !== "default") {
    searchParams.set("deadlineSort", deadlineSortId);
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  if (size) {
    searchParams.set("size", String(size));
  }

  const queryString = searchParams.toString();
  const requestUrl = queryString ? `/api/search?${queryString}` : "/api/search";
  const response = await fetch(requestUrl);

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(`FAILED_TO_GET_SEARCH_RESULTS: ${response.status} ${errorBody}`);
  }

  return response.json();
};
