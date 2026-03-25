import type { SearchResultsResponse } from "@/entities/gathering";

import type { SearchResultsCategoryId } from "../model/search-params";

interface GetSearchResultsRequest {
  categoryId: SearchResultsCategoryId;
  cursor?: string | null;
  size?: number;
}

export const getSearchResults = async ({
  categoryId,
  cursor,
  size,
}: GetSearchResultsRequest): Promise<SearchResultsResponse> => {
  const searchParams = new URLSearchParams();

  if (categoryId !== "all") {
    searchParams.set("category", categoryId);
  }

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  if (size) {
    searchParams.set("size", String(size));
  }

  const queryString = searchParams.toString();
  const response = await fetch(queryString ? `/api/search?${queryString}` : "/api/search");

  if (!response.ok) {
    throw new Error("FAILED_TO_GET_SEARCH_RESULTS");
  }

  return response.json();
};
