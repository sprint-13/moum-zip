export type MemberRole = "admin" | "moderator" | "member";
export type MemberStatus = "online" | "offline";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: MemberRole;
  status: MemberStatus;
}
