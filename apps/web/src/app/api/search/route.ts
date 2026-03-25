import { NextResponse } from "next/server";

import { getSearchResults } from "@/_pages/space-search/use-cases/get-search-results";

const isCategoryId = (value: string | null): value is "all" | "study" | "project" => {
  return value === "all" || value === "study" || value === "project";
};

const parsePositiveInteger = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category");
  const cursor = searchParams.get("cursor");
  const size = parsePositiveInteger(searchParams.get("size"));

  const results = await getSearchResults({
    categoryId: isCategoryId(categoryId) ? categoryId : "all",
    cursor,
    size,
  });

  return NextResponse.json(results);
}
