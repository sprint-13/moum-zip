import { type UpdateMemberProfileActionInput, updateMemberProfileAction } from "@/_pages/space/actions";
import type { Member } from "@/entities/member";
import { uploadProfileImage } from "./upload-profile-image";

interface SpaceMemberProfileDraft {
  avatarUrl?: string;
  email: string;
  nickname: string;
}

interface SaveSpaceMemberProfileInput {
  editingImageFile: File | null;
  editingProfile: SpaceMemberProfileDraft;
  initialProfile: SpaceMemberProfileDraft;
  slug: string;
}

const getTrimmedProfile = ({ email, nickname }: Pick<SpaceMemberProfileDraft, "email" | "nickname">) => ({
  email: email.trim(),
  nickname: nickname.trim(),
});

const createProfileUpdatePayload = (
  initialProfile: SpaceMemberProfileDraft,
  editingProfile: SpaceMemberProfileDraft,
): UpdateMemberProfileActionInput => {
  const { email: nextEmail, nickname: nextNickname } = getTrimmedProfile(editingProfile);
  const { email: initialEmail, nickname: initialNickname } = getTrimmedProfile(initialProfile);
  const payload: UpdateMemberProfileActionInput = {};

  if (nextNickname !== initialNickname) {
    payload.nickname = nextNickname;
  }

  if (nextEmail !== initialEmail) {
    payload.email = nextEmail;
  }

  return payload;
};

export async function saveSpaceMemberProfileUseCase({
  editingImageFile,
  editingProfile,
  initialProfile,
  slug,
}: SaveSpaceMemberProfileInput): Promise<Member | null> {
  const payload = createProfileUpdatePayload(initialProfile, editingProfile);

  if (editingImageFile) {
    payload.avatarUrl = await uploadProfileImage(editingImageFile);
  }

  if (Object.keys(payload).length === 0) {
    return null;
  }

  const { member } = await updateMemberProfileAction(slug, payload);
  return member;
}
