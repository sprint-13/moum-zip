import type { SearchResultsResponse } from "@/entities/gathering";
import { throwIfNotOk } from "@/shared/lib/errors/normalize-api-error";

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
  keyword,
  locationId,
  size,
}: GetSearchResultsRequest): Promise<SearchResultsResponse> => {
  const searchParams = new URLSearchParams();
  const normalizedKeyword = keyword?.trim();

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

  if (normalizedKeyword) {
    searchParams.set("keyword", normalizedKeyword);
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

  await throwIfNotOk(response, {
    fallbackMessage: "검색 결과를 불러오지 못했습니다.",
  });

  return response.json();
};
