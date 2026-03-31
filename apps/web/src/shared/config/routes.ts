export const ROUTES = {
  home: "/",
  search: "/search",
  moimCreate: "/moim-create",
  moimDetail: "/moim-detail",
  spaces: "/spaces",
  mypage: "/mypage",
  login: "/login",
  signup: "/signup",
} as const;

export const NAVIGATION_ROUTES = [
  { label: "모임 찾기", href: ROUTES.search },
  { label: "스페이스", href: ROUTES.spaces },
] as const;
