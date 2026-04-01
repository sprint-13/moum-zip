"use client";

import { ChevronsUpDown } from "@moum-zip/ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveSpaceMemberProfileUseCase } from "@/_pages/space/use-cases/save-space-member-profile";
import { isAllowedProfileImageType } from "@/_pages/space/use-cases/upload-profile-image";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileEditModal } from "./profile-edit-modal";
import { useSidebar } from "./sidebar";

interface SidebarFooterProps {
  slug: string;
  name: string;
  email: string | null;
  avatarUrl?: string;
}

interface SidebarProfileDraft {
  avatarUrl?: string;
  email: string;
  nickname: string;
}

const ALLOWED_PROFILE_SAVE_ERROR_MESSAGES = new Set([
  "JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요.",
  "닉네임을 입력해 주세요.",
  "닉네임은 20자 이하로 입력해 주세요.",
  "멤버 정보를 찾을 수 없습니다.",
  "프로필 이미지 업로드 URL 발급에 실패했어요.",
  "프로필 이미지 업로드 URL 정보가 올바르지 않아요",
  "프로필 이미지 업로드에 실패했어요.",
]);

const createSidebarProfile = ({ avatarUrl, email, name }: Omit<SidebarFooterProps, "slug">): SidebarProfileDraft => ({
  avatarUrl,
  email: email ?? "",
  nickname: name,
});

const getProfileSaveErrorMessage = (error: unknown) => {
  if (!(error instanceof Error) || !ALLOWED_PROFILE_SAVE_ERROR_MESSAGES.has(error.message)) {
    return "프로필 저장에 실패했어요. 다시 시도해 주세요.";
  }

  return error.message;
};

export const SidebarFooter = ({ slug, name, email, avatarUrl }: SidebarFooterProps) => {
  const { open, setOpen } = useSidebar();
  const isProfileModalOpenRef = useRef(false);
  const previewAvatarUrlRef = useRef<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState(() => createSidebarProfile({ avatarUrl, email, name }));
  const [initialEditingProfile, setInitialEditingProfile] = useState(() =>
    createSidebarProfile({ avatarUrl, email, name }),
  );
  const [editingProfile, setEditingProfile] = useState(() => createSidebarProfile({ avatarUrl, email, name }));
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);

  const revokePreviewAvatarUrl = useCallback(() => {
    if (!previewAvatarUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(previewAvatarUrlRef.current);
    previewAvatarUrlRef.current = null;
  }, []);

  const applyEditingSnapshot = useCallback(
    (nextProfile: SidebarProfileDraft) => {
      revokePreviewAvatarUrl();
      setInitialEditingProfile({ ...nextProfile });
      setEditingProfile({ ...nextProfile });
      setEditingImageFile(null);
      setErrorMessage(null);
    },
    [revokePreviewAvatarUrl],
  );

  useEffect(() => {
    isProfileModalOpenRef.current = isProfileModalOpen;
  }, [isProfileModalOpen]);

  useEffect(() => {
    const nextProfile = createSidebarProfile({ avatarUrl, email, name });
    setProfile(nextProfile);

    if (!isProfileModalOpenRef.current) {
      applyEditingSnapshot(nextProfile);
    }
  }, [avatarUrl, email, name, applyEditingSnapshot]);

  useEffect(() => {
    return () => {
      revokePreviewAvatarUrl();
    };
  }, [revokePreviewAvatarUrl]);

  const updateEditingProfile = (changes: Partial<SidebarProfileDraft>) => {
    setErrorMessage(null);
    setEditingProfile((prevProfile) => ({
      ...prevProfile,
      ...changes,
    }));
  };

  const isProfileChanged =
    editingImageFile !== null ||
    editingProfile.nickname.trim() !== initialEditingProfile.nickname.trim() ||
    editingProfile.email.trim() !== initialEditingProfile.email.trim();
  const isSaveDisabled =
    isSaving || !isProfileChanged || editingProfile.nickname.trim() === "" || editingProfile.email.trim() === "";

  const handleProfileModalOpen = () => {
    if (!open) {
      setOpen(true);
    }

    applyEditingSnapshot(profile);
    setIsProfileModalOpen(true);
  };

  const handleProfileEditingCancel = () => {
    if (isSaving) {
      return;
    }

    applyEditingSnapshot(profile);
    setIsProfileModalOpen(false);
  };

  const handleProfileImageChange = (imageFile: File) => {
    if (!isAllowedProfileImageType(imageFile.type)) {
      setErrorMessage("JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요");
      return;
    }

    revokePreviewAvatarUrl();

    const previewAvatarUrl = URL.createObjectURL(imageFile);
    previewAvatarUrlRef.current = previewAvatarUrl;
    setEditingImageFile(imageFile);
    setErrorMessage(null);
    updateEditingProfile({ avatarUrl: previewAvatarUrl });
  };

  const handleProfileAvatarReset = () => {
    revokePreviewAvatarUrl();
    setEditingImageFile(null);
    setErrorMessage(null);
    updateEditingProfile({ avatarUrl: initialEditingProfile.avatarUrl });
  };

  const handleProfileSave = async () => {
    if (isSaving) {
      return;
    }

    if (editingProfile.nickname.trim() === "" || editingProfile.email.trim() === "") {
      setErrorMessage("닉네임과 이메일을 입력해 주세요.");
      return;
    }

    if (!isProfileChanged) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const member = await saveSpaceMemberProfileUseCase({
        editingImageFile,
        editingProfile,
        initialProfile: initialEditingProfile,
        slug,
      });

      if (!member) {
        setErrorMessage("프로필 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      const nextProfile = createSidebarProfile({
        avatarUrl: member.avatarUrl ?? undefined,
        email: member.email,
        name: member.nickname,
      });

      setProfile(nextProfile);
      applyEditingSnapshot(nextProfile);
      setIsProfileModalOpen(false);
    } catch (error) {
      setErrorMessage(getProfileSaveErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const triggerButtonClassName = open
    ? "hidden w-full items-center justify-between rounded-md bg-muted/30 p-2 text-left transition-colors hover:bg-muted md:flex"
    : "py-1";

  return (
    <>
      <button
        type="button"
        onClick={handleProfileModalOpen}
        className={triggerButtonClassName}
        aria-haspopup="dialog"
        aria-label="프로필 수정 열기"
      >
        {open ? (
          <>
            <div className="flex items-center gap-2">
              <ProfileAvatar imageUrl={profile.avatarUrl} name={profile.nickname} />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-foreground text-sm">{profile.nickname}</span>
                <span className="truncate text-foreground/70 text-xs">{profile.email}</span>
              </div>
            </div>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </>
        ) : (
          <ProfileAvatar imageUrl={profile.avatarUrl} name={profile.nickname} />
        )}
      </button>

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        isSaving={isSaving}
        errorMessage={errorMessage}
        isSaveDisabled={isSaveDisabled}
        canResetAvatar={editingImageFile !== null}
        profile={editingProfile}
        onAvatarReset={handleProfileAvatarReset}
        onCancel={handleProfileEditingCancel}
        onImageChange={handleProfileImageChange}
        onProfileChange={updateEditingProfile}
        onSave={handleProfileSave}
      />
    </>
  );
};
