export const GATHERING_CATEGORY_SPECS = [
  {
    id: "study",
    label: "스터디",
    requestType: "스터디",
  },
  {
    id: "project",
    label: "프로젝트",
    requestType: "프로젝트",
  },
] as const;

export type GatheringCategoryId = (typeof GATHERING_CATEGORY_SPECS)[number]["id"];

const categorySpecById = Object.fromEntries(
  GATHERING_CATEGORY_SPECS.map((category) => [category.id, category]),
) as Record<GatheringCategoryId, (typeof GATHERING_CATEGORY_SPECS)[number]>;

export const normalizeGatheringCategory = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "study" || normalizedValue === "스터디") {
    return "study" as const;
  }

  if (normalizedValue === "project" || normalizedValue === "프로젝트") {
    return "project" as const;
  }

  return null;
};

export const getGatheringCategoryLabel = (categoryId: GatheringCategoryId) => {
  return categorySpecById[categoryId].label;
};

export const getGatheringCategoryRequestType = (categoryId: GatheringCategoryId) => {
  return categorySpecById[categoryId].requestType;
};
