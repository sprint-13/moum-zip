import { type Member, memberQueries } from "@/entities/member";

export interface UpdateMemberProfileInput {
  avatarUrl?: string | null;
  email?: string | null;
  nickname: string;
  spaceId: string;
  userId: number;
}

export async function updateMemberProfileUseCase(input: UpdateMemberProfileInput): Promise<Member> {
  const nickname = input.nickname.trim();
  const email = input.email?.trim();
  const avatarUrl = input.avatarUrl?.trim();

  if (!nickname) {
    throw new Error("닉네임을 입력해주세요.");
  }

  if (nickname.length > 20) {
    throw new Error("닉네임은 20자 이하로 입력해주세요.");
  }

  const updatedMember = await memberQueries.update(input.spaceId, input.userId, {
    avatarUrl: avatarUrl || null,
    email: email || null,
    nickname,
  });

  if (!updatedMember) {
    throw new Error("멤버 정보를 찾을 수 없습니다.");
  }

  return updatedMember;
}
