import {
  revalidateSpaceProfileAction,
  type UpdateMemberProfileActionInput,
  updateMemberProfileAction,
} from "@/_pages/space/actions";
import type { Member } from "@/entities/member";
import { getProfileImagePresignedUrl, putProfileImage } from "./upload-profile-image";

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

const createProfileSavePayloads = (
  initialProfile: SpaceMemberProfileDraft,
  editingProfile: SpaceMemberProfileDraft,
): {
  payload: UpdateMemberProfileActionInput;
  rollbackPayload: UpdateMemberProfileActionInput;
} => {
  const { email: nextEmail, nickname: nextNickname } = getTrimmedProfile(editingProfile);
  const { email: initialEmail, nickname: initialNickname } = getTrimmedProfile(initialProfile);
  const payload: UpdateMemberProfileActionInput = {};
  const rollbackPayload: UpdateMemberProfileActionInput = {};

  if (nextNickname !== initialNickname) {
    payload.nickname = nextNickname;
    rollbackPayload.nickname = initialNickname;
  }

  if (nextEmail !== initialEmail) {
    payload.email = nextEmail;
    rollbackPayload.email = initialEmail;
  }

  return { payload, rollbackPayload };
};

export async function saveSpaceMemberProfileUseCase({
  editingImageFile,
  editingProfile,
  initialProfile,
  slug,
}: SaveSpaceMemberProfileInput): Promise<Member | null> {
  const { payload, rollbackPayload } = createProfileSavePayloads(initialProfile, editingProfile);

  if (Object.keys(payload).length === 0 && editingImageFile === null) {
    return null;
  }

  let profileImagePresignedUrl: string | null = null;

  if (editingImageFile) {
    const { presignedUrl, publicUrl } = await getProfileImagePresignedUrl(editingImageFile.name, editingImageFile.type);
    profileImagePresignedUrl = presignedUrl;
    payload.avatarUrl = publicUrl;
    rollbackPayload.avatarUrl = initialProfile.avatarUrl ?? null;
  }

  const { member } = await updateMemberProfileAction(slug, payload, {
    shouldRevalidate: editingImageFile === null,
  });

  if (!editingImageFile || !profileImagePresignedUrl) {
    return member;
  }

  try {
    await putProfileImage(profileImagePresignedUrl, editingImageFile);
  } catch {
    try {
      await updateMemberProfileAction(slug, rollbackPayload, {
        shouldRevalidate: false,
      });
    } catch {
      throw new Error("프로필 이미지 업로드에 실패했고 변경 내용을 되돌리지 못했어요. 새로고침 후 다시 시도해 주세요.");
    }

    throw new Error("프로필 이미지 업로드에 실패해 변경 내용을 되돌렸어요. 다시 시도해 주세요.");
  }

  await revalidateSpaceProfileAction(slug).catch(() => undefined);

  return member;
}
