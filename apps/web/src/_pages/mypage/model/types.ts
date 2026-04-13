export type MypageTabKey = "joined" | "created" | "liked";
export type MypageBadgeVariant = "scheduled" | "waiting" | "completed" | "confirmed";
export type MypageActionVariant = "primary" | "secondary";
export type MoimImageTone = "beige" | "daylight" | "sunset" | "city";
export type CreatedFilterKey = "ongoing" | "ended";

export interface MypageProfile {
  userId: number;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface MypageBadge {
  label: string;
  variant: MypageBadgeVariant;
  withIcon?: boolean;
}

export interface MypageMoimCard {
  id: string;
  title: string;
  participantCount: string;
  location: string;
  date: string;
  time: string;
  imageUrl?: string;
  liked: boolean;
  imageTone: MoimImageTone;
  actionLabel: string;
  actionVariant: MypageActionVariant;
  primaryBadge: MypageBadge;
  secondaryBadge?: MypageBadge;
}
