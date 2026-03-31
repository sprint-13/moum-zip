"use client";

import { ChevronsUpDown } from "@moum-zip/ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileEditModal } from "./profile-edit-modal";
import { useSidebar } from "./sidebar";

interface SidebarFooterProps {
  name: string;
  email: string | null;
  avatarUrl?: string;
}

interface SidebarProfile {
  avatarUrl?: string;
  email: string | null;
  nickname: string;
}

const createSidebarProfile = ({ avatarUrl, email, name }: SidebarFooterProps): SidebarProfile => ({
  avatarUrl,
  email,
  nickname: name,
});

export const SidebarFooter = ({ name, email, avatarUrl }: SidebarFooterProps) => {
  const { open, setOpen } = useSidebar();
  const currentAvatarUrlRef = useRef<string | null>(null);
  const editingAvatarUrlRef = useRef<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(() => createSidebarProfile({ avatarUrl, email, name }));
  const [editingProfile, setEditingProfile] = useState(() => createSidebarProfile({ avatarUrl, email, name }));

  const revokeCurrentAvatarUrl = useCallback(() => {
    if (!currentAvatarUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(currentAvatarUrlRef.current);
    currentAvatarUrlRef.current = null;
  }, []);

  const revokeEditingAvatarUrl = useCallback(() => {
    if (!editingAvatarUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(editingAvatarUrlRef.current);
    editingAvatarUrlRef.current = null;
  }, []);

  useEffect(() => {
    revokeEditingAvatarUrl();
    revokeCurrentAvatarUrl();

    const nextProfile = createSidebarProfile({ avatarUrl, email, name });
    setProfile(nextProfile);
    setEditingProfile(nextProfile);
  }, [avatarUrl, email, name, revokeCurrentAvatarUrl, revokeEditingAvatarUrl]);

  useEffect(() => {
    return () => {
      revokeEditingAvatarUrl();
      revokeCurrentAvatarUrl();
    };
  }, [revokeCurrentAvatarUrl, revokeEditingAvatarUrl]);

  const updateEditingProfile = (changes: Partial<SidebarProfile>) => {
    setEditingProfile((prevProfile) => ({
      ...prevProfile,
      ...changes,
    }));
  };

  const resetEditingProfile = () => {
    revokeEditingAvatarUrl();
    setEditingProfile({ ...profile });
  };

  const handleProfileModalOpen = () => {
    if (!open) {
      setOpen(true);
    }

    resetEditingProfile();
    setIsProfileModalOpen(true);
  };

  const handleProfileModalCancel = () => {
    resetEditingProfile();
    setIsProfileModalOpen(false);
  };

  const handleProfileImageChange = (imageFile: File) => {
    revokeEditingAvatarUrl();

    const nextAvatarUrl = URL.createObjectURL(imageFile);
    editingAvatarUrlRef.current = nextAvatarUrl;
    updateEditingProfile({ avatarUrl: nextAvatarUrl });
  };

  const handleProfileImageRemove = () => {
    revokeEditingAvatarUrl();
    updateEditingProfile({ avatarUrl: undefined });
  };

  const handleProfileSave = () => {
    if (editingAvatarUrlRef.current) {
      revokeCurrentAvatarUrl();
      currentAvatarUrlRef.current = editingAvatarUrlRef.current;
      editingAvatarUrlRef.current = null;
    } else if (!editingProfile.avatarUrl) {
      revokeCurrentAvatarUrl();
    }

    setProfile({ ...editingProfile });
    setIsProfileModalOpen(false);
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
        profile={editingProfile}
        onCancel={handleProfileModalCancel}
        onImageChange={handleProfileImageChange}
        onImageRemove={handleProfileImageRemove}
        onProfileChange={updateEditingProfile}
        onSave={handleProfileSave}
      />
    </>
  );
};
