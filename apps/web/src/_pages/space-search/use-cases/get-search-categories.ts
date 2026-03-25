import type { MeetingTypesListData } from "@moum-zip/api/data-contracts";

import { GATHERING_CATEGORY_SPECS, getGatheringCategoryLabel, normalizeGatheringCategory } from "@/entities/gathering";
import type { SpaceSearchCategory } from "@/features/space-search/model/types";
import { api } from "@/shared/api";

const DEFAULT_SEARCH_CATEGORY: SpaceSearchCategory = { id: "all", label: "전체" };
const SEARCH_CATEGORY_ORDER = GATHERING_CATEGORY_SPECS.map(({ id }) => id);

interface GetSearchCategoriesDeps {
  meetingTypesApi?: Pick<typeof api.meetingTypes, "getList">;
}

export const getSearchCategories = async ({
  meetingTypesApi = api.meetingTypes,
}: GetSearchCategoriesDeps = {}): Promise<SpaceSearchCategory[]> => {
  try {
    const response = await meetingTypesApi.getList();
    const meetingTypes = response.data as MeetingTypesListData;
    const categoryIds = new Set(meetingTypes.map(({ name }) => normalizeGatheringCategory(name)).filter(Boolean));
    const categories = SEARCH_CATEGORY_ORDER.filter((categoryId) => categoryIds.has(categoryId)).map((categoryId) => ({
      id: categoryId,
      label: getGatheringCategoryLabel(categoryId),
    }));

    return [DEFAULT_SEARCH_CATEGORY, ...categories];
  } catch {
    return [DEFAULT_SEARCH_CATEGORY];
  }
};
