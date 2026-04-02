import { type Member, memberQueries, type NewMember } from "@/entities/member";

export type PendingUser = {
  userId: number;
  name: string;
  image: string;
};

export const addSpaceMemberUseCase = async (
  spaceId: string,
  userId: number,
  name: string,
  image: string,
): Promise<Member | null> => {
  const existing = await memberQueries.getMember(spaceId, userId);
  if (existing) return existing;

  const newMember: NewMember = {
    id: crypto.randomUUID(),
    spaceId,
    userId,
    nickname: name,
    role: "member",
    email: null,
    avatarUrl: image,
  };
  const row = await memberQueries.create(newMember);
  return row;
};
