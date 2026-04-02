"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Button,
  InputField,
} from "@moum-zip/ui/components";
import { Pencil, X } from "@moum-zip/ui/icons";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import { PROFILE_IMAGE_ACCEPT } from "@/_pages/space/use-cases/upload-profile-image";
import { useSpaceContext } from "@/features/space";
import { ProfileAvatar } from "./profile-avatar";

interface ProfileEditModalProfile {
  avatarUrl?: string;
  email: string;
  nickname: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  isSaveDisabled: boolean;
  canResetAvatar: boolean;
  profile: ProfileEditModalProfile;
  onAvatarReset: () => void;
  onCancel: () => void;
  onImageChange: (imageFile: File) => void;
  onProfileChange: (changes: Partial<ProfileEditModalProfile>) => void;
  onSave: () => void | Promise<void>;
}

export const ProfileEditModal = ({
  isOpen,
  isSaving,
  errorMessage,
  isSaveDisabled,
  canResetAvatar,
  profile,
  onAvatarReset,
  onCancel,
  onImageChange,
  onProfileChange,
  onSave,
}: ProfileEditModalProps) => {
  const { container } = useSpaceContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl, email, nickname } = profile;

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    onImageChange(imageFile);
    event.target.value = "";
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isSaving) {
          onCancel();
        }
      }}
    >
      <AlertDialogContent
        container={container}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-120 gap-0 overflow-y-auto rounded-3xl border border-primary/20 bg-background p-5 shadow-xl sm:rounded-[1.75rem] sm:p-7"
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <AlertDialogTitle className="text-left font-bold text-foreground text-lg sm:text-xl">
              프로필 수정
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-left text-muted-foreground text-xs sm:text-sm">
              스페이스에서 보이는 프로필 정보를 수정할 수 있어요.
            </AlertDialogDescription>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="프로필 수정 닫기"
            disabled={isSaving}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4 sm:mt-6 sm:p-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <ProfileAvatar
              className="size-14 text-sm sm:size-16 sm:text-base"
              imageUrl={avatarUrl}
              name={nickname}
              textClassName="text-sm sm:text-base"
            />
            <div className="min-w-0 flex-1">
              <p className="text-center font-semibold text-foreground text-sm sm:text-left">프로필 이미지</p>
              <p className="mt-1 text-center text-muted-foreground text-sm sm:text-left">
                새 이미지를 선택할 수 있어요.
              </p>
              <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:justify-start">
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  className="w-full min-w-0 justify-center gap-1 px-3 text-primary sm:w-auto"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  icon={<Pencil size={14} />}
                >
                  이미지 변경
                </Button>
                {canResetAvatar ? (
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    className="w-full min-w-0 px-3 sm:w-auto"
                    onClick={onAvatarReset}
                    disabled={isSaving}
                  >
                    되돌리기
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            className="hidden"
            onChange={handleImageInputChange}
          />
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-5">
          <InputField
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            required
            value={nickname}
            className="max-w-full bg-background max-md:max-w-full!"
            onChange={(event) => onProfileChange({ nickname: event.target.value })}
          />
          <InputField
            label="이메일"
            placeholder="이메일을 입력해주세요"
            required
            value={email}
            className="max-w-full bg-background max-md:max-w-full!"
            onChange={(event) => onProfileChange({ email: event.target.value })}
          />
        </div>

        {errorMessage ? <p className="mt-4 text-destructive text-sm">{errorMessage}</p> : null}

        <div className="mt-5 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            size="small"
            className="h-11 w-full min-w-0 text-primary"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type="button"
            size="small"
            className="h-11 w-full min-w-0"
            onClick={onSave}
            disabled={isSaveDisabled || isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
