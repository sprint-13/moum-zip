"use client";

import { Button, toast } from "@ui/components";
import { Input } from "@ui/components/shadcn/input";
import { Pencil } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import { type ChangeEvent, startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { updateProfileAction } from "@/_pages/mypage/actions";
import type { MypageProfile } from "../model/types";
import ProfileAvatar from "./profile-avatar";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MypageProfile;
}

const ERROR_MESSAGES = {
  EMPTY_NAME: "이름을 입력해주세요.",
  NAME_TOO_LONG: "이름은 20자 이하로 입력해주세요.",
  UNAUTHORIZED: "로그인이 만료되었어요. 다시 로그인해주세요.",
  SERVER_ERROR: "프로필 수정 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
} as const;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export default function ProfileEditModal({ isOpen, onClose, profile }: ProfileEditModalProps) {
  const nameInputId = useId();
  const emailInputId = useId();
  const titleId = useId();
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState(profile.imageUrl);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
      previousFocusedElementRef.current?.focus();
      previousFocusedElementRef.current = null;
      return;
    }

    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialogElement = dialogRef.current;
      if (!dialogElement) {
        return;
      }

      const focusableElements = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (state?.ok) {
      // 서버 액션 성공 시 토스트를 보여주고 모달을 닫습니다.
      toast({
        message: "프로필을 수정했어요.",
        size: "small",
      });
      onClose();
    }
  }, [state, onClose]);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleSelectImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast({
        message: "JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있어요.",
        size: "small",
      });
      event.target.value = "";
      return;
    }

    setIsUploadingImage(true);

    try {
      // 1) 서버에서 presigned URL을 발급받고
      const response = await fetch("/api/images/presigned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          folder: "users",
        }),
      });

      if (!response.ok) {
        throw new Error("PRESIGNED_URL_REQUEST_FAILED");
      }

      const { presignedUrl, publicUrl } = (await response.json()) as {
        presignedUrl: string;
        publicUrl: string;
      };

      // 2) 발급받은 URL로 파일을 직접 업로드한 뒤 publicUrl을 저장 액션에 넘깁니다.
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("IMAGE_UPLOAD_FAILED");
      }

      setUploadedImageUrl(publicUrl);
      setPreviewImageUrl(publicUrl);
      toast({
        message: "프로필 이미지를 업로드했어요.",
        size: "small",
      });
    } catch (_error) {
      toast({
        message: "프로필 이미지 업로드에 실패했어요. 다시 시도해주세요.",
        size: "small",
      });
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const isBusy = isPending || isUploadingImage;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 transition-all",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[34rem] flex-col rounded-3xl bg-card px-6 py-6 shadow-xl md:px-12 md:py-12"
      >
        <form action={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-bold text-foreground text-xl leading-tight md:text-2xl">
              프로필 수정하기
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-full text-foreground/70 md:size-8"
              aria-label="프로필 수정 모달 닫기"
            >
              <svg viewBox="0 0 24 24" className="size-5 stroke-current md:size-6" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center md:mt-8">
            <div className="relative aspect-[116/119] w-full max-w-[6.5rem] md:max-w-[7.25rem]">
              <ProfileAvatar
                className="h-[calc(100%-0.125rem)] w-[calc(100%-0.125rem)]"
                src={previewImageUrl}
                alt={`${profile.name} 프로필 이미지`}
              />
              <button
                type="button"
                onClick={handleSelectImage}
                disabled={isBusy}
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-60 md:size-9"
                aria-label="프로필 이미지 수정"
              >
                <Pencil size={14} aria-hidden="true" className="md:size-4" />
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="mt-8 space-y-4 md:mt-12 md:space-y-5">
            <input type="hidden" name="image" value={uploadedImageUrl} />

            <label htmlFor={nameInputId} className="block space-y-2">
              <span className="font-semibold text-slate-800 text-sm leading-none">이름</span>
              <Input
                id={nameInputId}
                name="name"
                defaultValue={profile.name}
                maxLength={20}
                disabled={isBusy}
                className="h-12 rounded-2xl border-0 bg-gray-50 px-4 font-medium text-base text-slate-800 leading-none shadow-none focus-visible:ring-0 md:h-[3.25rem]"
              />
            </label>

            <label htmlFor={emailInputId} className="block space-y-2">
              <span className="font-semibold text-slate-800 text-sm leading-none">이메일</span>
              <Input
                id={emailInputId}
                defaultValue={profile.email}
                readOnly
                className="h-12 rounded-2xl border-0 bg-gray-50 px-4 font-medium text-base text-slate-800 leading-none shadow-none focus-visible:ring-0 md:h-[3.25rem]"
              />
            </label>

            {state && !state.ok ? <p className="text-red-500 text-sm">{ERROR_MESSAGES[state.error]}</p> : null}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:gap-4">
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="h-12 w-full text-sm md:h-15 md:text-base"
              onClick={onClose}
              disabled={isBusy}
            >
              취소
            </Button>
            <Button type="submit" size="small" className="h-12 w-full text-sm md:h-15 md:text-base" disabled={isBusy}>
              수정하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
