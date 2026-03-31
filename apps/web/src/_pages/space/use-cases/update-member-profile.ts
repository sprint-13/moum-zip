import { type Member, memberQueries } from "@/entities/member";

export interface UpdateMemberProfileInput {
  avatarUrl?: string | null;
  email?: string | null;
  nickname?: string;
  spaceId: string;
  userId: number;
}

export async function updateMemberProfileUseCase(input: UpdateMemberProfileInput): Promise<Member> {
  // 유저가 변경 안하고 요청 시 omit처리 -> partial update
  const updatePayload: Parameters<typeof memberQueries.update>[2] = {};

  if (input.nickname !== undefined) {
    const nickname = input.nickname.trim();

    if (!nickname) {
      throw new Error("닉네임을 입력해주세요.");
    }

    if (nickname.length > 20) {
      throw new Error("닉네임은 20자 이하로 입력해주세요.");
    }

    updatePayload.nickname = nickname;
  }

  if (input.email !== undefined) {
    const email = input.email?.trim();
    updatePayload.email = email || null;
  }

  if (input.avatarUrl !== undefined) {
    const avatarUrl = input.avatarUrl?.trim();
    updatePayload.avatarUrl = avatarUrl || null;
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new Error("수정할 프로필 정보가 없습니다.");
  }

  const updatedMember = await memberQueries.update(input.spaceId, input.userId, updatePayload);

  if (!updatedMember) {
    throw new Error("멤버 정보를 찾을 수 없습니다.");
  }

  return updatedMember;
}
