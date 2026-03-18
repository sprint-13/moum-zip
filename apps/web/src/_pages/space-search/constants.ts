import type { SpaceSearchCardItem, SpaceSearchCategory, SpaceSearchFilter, SpaceSearchNavItem } from "./types";

export const SPACE_SEARCH_ASSETS = {
  avatarSrc: "https://www.figma.com/api/mcp/asset/2fa5da1e-de47-4dba-b984-bfa9a7a230fe",
  logoSrc: "https://www.figma.com/api/mcp/asset/85126cc5-1131-4fc3-a9fb-0880f53d25e7",
  notificationBellIconSrc: "https://www.figma.com/api/mcp/asset/359782de-d351-4d9c-a4ed-20c79c62332e",
} as const;

export const SPACE_SEARCH_HERO_BANNER_ASSETS = {
  mb: {
    height: 192,
    src: "/images/space-search/hero/banner-mb.svg",
    width: 375,
  },
  pc: {
    height: 244,
    src: "/images/space-search/hero/banner-pc.svg",
    width: 1280,
  },
  tb: {
    height: 244,
    src: "/images/space-search/hero/banner-tb.svg",
    width: 696,
  },
} as const;

export const SPACE_SEARCH_HERO_CONTENT = {
  description: "함께할 사람을 찾고 계신가요?",
  title: "지금 스페이스에 참여해보세요",
} as const;

export const SPACE_SEARCH_NAV_ITEMS: SpaceSearchNavItem[] = [
  {
    href: "/space",
    id: "space-search",
    isActive: true,
    label: "스페이스 찾기",
  },
  {
    href: "/liked-space",
    id: "liked-space",
    label: "찜한 스페이스",
    notificationCount: 1,
  },
  {
    href: "/space-home",
    id: "space-home",
    label: "스페이스",
  },
];

export const SPACE_SEARCH_CATEGORIES: SpaceSearchCategory[] = [
  { id: "all", isActive: true, label: "전체" },
  { id: "hobby", label: "취미/여가" },
  { id: "study", label: "스터디" },
  { id: "business", label: "비즈니스" },
  { id: "health", label: "운동/건강" },
  { id: "family", label: "가족/육아" },
  { id: "etc", label: "기타" },
];

export const SPACE_SEARCH_FILTERS: SpaceSearchFilter[] = [
  { id: "date", label: "날짜 전체" },
  { id: "district", label: "지역 전체" },
  { id: "deadline", isSelected: true, label: "마감 임박" },
];

export const SPACE_SEARCH_ITEMS: SpaceSearchCardItem[] = [
  {
    category: "운동/건강",
    currentParticipants: 4,
    deadlineLabel: "오늘 21시 마감",
    district: "강남구",
    id: "space-card-1",
    imageAlt: "밝은 스트레칭 공간",
    imageSrc: "https://www.figma.com/api/mcp/asset/fa6ac266-bd89-4abd-ab65-b3c8606c015e",
    maxParticipants: 20,
    metaChips: [
      { id: "date", label: "1월 7일" },
      { id: "time", label: "17:30" },
    ],
    title: "힐링 오피스 스트레칭",
  },
  {
    category: "취미/여가",
    currentParticipants: 19,
    deadlineLabel: "오늘 21시 마감",
    district: "중구",
    id: "space-card-2",
    imageAlt: "통창이 있는 독서 공간",
    imageSrc: "https://www.figma.com/api/mcp/asset/4625a75b-412c-4bb7-b1c0-a24215fd36f6",
    isLiked: true,
    maxParticipants: 20,
    metaChips: [
      { id: "date", label: "1월 7일" },
      { id: "time", label: "17:30" },
    ],
    status: {
      label: "개설확정",
    },
    title: "작은 독서 습관 만들기",
  },
  {
    category: "취미/여가",
    currentParticipants: 12,
    deadlineLabel: "오늘 21시 마감",
    district: "용산구",
    id: "space-card-3",
    imageAlt: "감각적인 카페 내부",
    imageSrc: "https://www.figma.com/api/mcp/asset/a4b7bd93-bd2b-493b-ab38-2c392ac3dc00",
    maxParticipants: 20,
    metaChips: [
      { id: "date", label: "1월 7일" },
      { id: "time", label: "17:30" },
    ],
    status: {
      label: "개설확정",
    },
    title: "카페 투어 멤버 모집",
  },
  {
    category: "스터디",
    currentParticipants: 4,
    deadlineLabel: "2일 후 마감",
    district: "동작구",
    id: "space-card-4",
    imageAlt: "유리창이 많은 회화 공간",
    imageSrc: "https://www.figma.com/api/mcp/asset/fe2081f5-580a-4342-9e3f-1b0b1c39d75d",
    maxParticipants: 20,
    metaChips: [
      { id: "date", label: "1월 7일" },
      { id: "time", label: "17:30" },
    ],
    title: "영어 롤플레이 회화반",
  },
  {
    category: "운동/건강",
    currentParticipants: 12,
    deadlineLabel: "오늘 21시 마감",
    district: "중구",
    id: "space-card-5",
    imageAlt: "어깨 스트레칭을 위한 공간",
    imageSrc: "https://www.figma.com/api/mcp/asset/a14fbce8-49c1-452b-ae78-f58297c88024",
    maxParticipants: 20,
    metaChips: [
      { id: "date", label: "1월 7일" },
      { id: "time", label: "17:30" },
    ],
    title: "굽은 어깨 펴기 스페이스",
  },
  {
    category: "기타",
    currentParticipants: 12,
    deadlineLabel: "오늘 21시 마감",
    district: "마포구",
    id: "space-card-6",
    imageAlt: "요가 클래스 홍보 이미지",
    imageSrc: "https://www.figma.com/api/mcp/asset/ce86979a-9059-4f6a-b62f-9403acb6c0e5",
    maxParticipants: 20,
    metaChips: [
      { id: "date", label: "1월 7일" },
      { id: "time", label: "17:30" },
    ],
    title: "요가 원데이 클래스",
  },
];

export const SPACE_SEARCH_PAGINATION = {
  currentPage: 1,
  totalPages: 6,
} as const;
