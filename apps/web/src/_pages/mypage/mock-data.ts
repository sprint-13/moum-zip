export type MypageTabKey = "joined" | "created" | "liked";
export type MypageBadgeVariant = "scheduled" | "waiting" | "completed" | "confirmed";
export type MypageActionVariant = "primary" | "secondary";
export type MoimImageTone = "beige" | "daylight" | "sunset" | "city";

export interface ProfileMockData {
  name: string;
  email: string;
  imageUrl?: string;
}

export interface BadgeMockData {
  label: string;
  variant: MypageBadgeVariant;
  withIcon?: boolean;
}

export interface MoimCardMockData {
  id: string;
  title: string;
  participantCount: string;
  location: string;
  date: string;
  time: string;
  liked: boolean;
  imageTone: MoimImageTone;
  actionLabel: string;
  actionVariant: MypageActionVariant;
  primaryBadge: BadgeMockData;
  secondaryBadge?: BadgeMockData;
}

export const profileMockData: ProfileMockData = {
  name: "럽윈즈올",
  email: "lovewins@codeit.com",
};

export const mypageTabs: Array<{ key: MypageTabKey; label: string }> = [
  { key: "joined", label: "나의 모임" },
  { key: "created", label: "내가 만든 모임" },
  { key: "liked", label: "찜한 모임" },
];

export const mypageMoimMockData: Record<MypageTabKey, MoimCardMockData[]> = {
  joined: [
    {
      id: "joined-1",
      title: "모임 Title",
      participantCount: "20/20",
      location: "을지로 3가",
      date: "11월 17일",
      time: "17:30",
      liked: true,
      imageTone: "beige",
      actionLabel: "스페이스 입장",
      actionVariant: "primary",
      primaryBadge: { label: "참여 중", variant: "scheduled" },
      secondaryBadge: { label: "개설확정", variant: "confirmed", withIcon: true },
    },
    {
      id: "joined-2",
      title: "모임 Title",
      participantCount: "20/20",
      location: "중구",
      date: "11월 17일",
      time: "17:30",
      liked: false,
      imageTone: "daylight",
      actionLabel: "스페이스 입장",
      actionVariant: "secondary",
      primaryBadge: { label: "참여 예정", variant: "scheduled" },
      secondaryBadge: { label: "개설대기", variant: "waiting" },
    },
    {
      id: "joined-3",
      title: "모임 Title",
      participantCount: "20/20",
      location: "용산구",
      date: "11월 17일",
      time: "17:30",
      liked: false,
      imageTone: "sunset",
      actionLabel: "스페이스 입장",
      actionVariant: "secondary",
      primaryBadge: { label: "참여 완료", variant: "completed" },
    },
    {
      id: "joined-4",
      title: "모임 Title",
      participantCount: "20/20",
      location: "을지로 3가",
      date: "11월 17일",
      time: "17:30",
      liked: false,
      imageTone: "city",
      actionLabel: "스페이스 입장",
      actionVariant: "secondary",
      primaryBadge: { label: "이용 예정", variant: "scheduled" },
      secondaryBadge: { label: "개설대기", variant: "waiting" },
    },
  ],
  created: [
    {
      id: "created-1",
      title: "내가 만든 모임",
      participantCount: "14/20",
      location: "성수동",
      date: "12월 2일",
      time: "19:00",
      liked: true,
      imageTone: "city",
      actionLabel: "스페이스 입장",
      actionVariant: "primary",
      primaryBadge: { label: "참여 중", variant: "scheduled" },
      secondaryBadge: { label: "개설확정", variant: "confirmed", withIcon: true },
    },
  ],
  liked: [
    {
      id: "liked-1",
      title: "찜한 모임",
      participantCount: "7/10",
      location: "합정",
      date: "12월 10일",
      time: "14:00",
      liked: true,
      imageTone: "daylight",
      actionLabel: "스페이스 입장",
      actionVariant: "secondary",
      primaryBadge: { label: "참여 예정", variant: "scheduled" },
      secondaryBadge: { label: "개설대기", variant: "waiting" },
    },
  ],
};

export const createdMoimMockData: Record<"ongoing" | "ended", MoimCardMockData[]> = {
  ongoing: mypageMoimMockData.created,
  ended: [
    /*
    {
      id: "created-ended-1",
      title: "지난 모임 Title",
      participantCount: "14/20",
      location: "강남구",
      date: "11월 17일",
      time: "17:30",
      liked: true,
      imageTone: "beige",
      actionLabel: "스페이스 입장",
      actionVariant: "primary",
      primaryBadge: { label: "진행 완료", variant: "completed" },
    },
    */
  ],
};
