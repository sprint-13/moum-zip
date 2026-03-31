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
import { ProfileAvatar } from "./profile-avatar";

interface ProfileEditModalProfile {
  avatarUrl?: string;
  email: string;
  nickname: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: ProfileEditModalProfile;
  onCancel: () => void;
  onImageChange: (imageFile: File) => void;
  onImageRemove: () => void;
  onProfileChange: (changes: Partial<ProfileEditModalProfile>) => void;
  onSave: () => void;
}

export const ProfileEditModal = ({
  isOpen,
  profile,
  onCancel,
  onImageChange,
  onImageRemove,
  onProfileChange,
  onSave,
}: ProfileEditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl, email, nickname } = profile;
  const isSaveDisabled = nickname.trim() === "" || email.trim() === "";

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onCancel();
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    onImageChange(imageFile);
    event.target.value = "";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-32px)] max-w-120 gap-0 rounded-[28px] border border-primary/20 bg-background p-6 shadow-xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <AlertDialogTitle className="text-left font-bold text-foreground text-xl">프로필 수정</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-left text-muted-foreground text-sm">
              스페이스에서 보이는 프로필 정보를 수정할 수 있어요.
            </AlertDialogDescription>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="프로필 수정 닫기"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-4">
            <ProfileAvatar
              className="size-16 text-base"
              imageUrl={avatarUrl}
              name={nickname}
              textClassName="text-base"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground text-sm">프로필 이미지</p>
              <p className="mt-1 text-muted-foreground text-sm">
                새 이미지를 선택하거나 현재 이미지를 삭제할 수 있어요.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  className="min-w-0 gap-2 px-4"
                  onClick={handleImageButtonClick}
                  icon={<Pencil size={14} />}
                >
                  이미지 변경
                </Button>
                {avatarUrl ? (
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    className="min-w-0 px-4"
                    onClick={onImageRemove}
                  >
                    이미지 삭제
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageInputChange}
          />
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <InputField
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            required
            value={nickname}
            className="max-w-full bg-background"
            onChange={(event) => onProfileChange({ nickname: event.target.value })}
          />
          <InputField
            label="이메일"
            placeholder="이메일을 입력해주세요"
            required
            value={email}
            className="max-w-full bg-background"
            onChange={(event) => onProfileChange({ email: event.target.value })}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" size="small" className="h-11 w-full min-w-0" onClick={onCancel}>
            취소
          </Button>
          <Button type="button" size="small" className="h-11 w-full min-w-0" onClick={onSave} disabled={isSaveDisabled}>
            저장
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
