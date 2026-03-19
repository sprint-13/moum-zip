"use client";

import { Button } from "@ui/components";
import { Input } from "@ui/components/shadcn/input";
import { Pencil } from "@ui/icons";
import { cn } from "@ui/lib/utils";
import { useId } from "react";
import type { ProfileMockData } from "../mock-data";
import ProfileAvatar from "./profile-avatar";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileMockData;
}

export default function ProfileEditModal({ isOpen, onClose, profile }: ProfileEditModalProps) {
  const nameInputId = useId();
  const emailInputId = useId();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 transition-all",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex w-full max-w-[34rem] flex-col rounded-3xl bg-card px-6 py-6 shadow-xl md:px-12 md:py-12">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-bold text-foreground text-xl leading-tight md:text-2xl">프로필 수정하기</h2>
          <button
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
            <ProfileAvatar className="w-[calc(100%-0.125rem)]" />
            <button
              type="button"
              className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm md:size-9"
              aria-label="프로필 이미지 수정"
            >
              <Pencil size={14} aria-hidden="true" className="md:size-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4 md:mt-12 md:space-y-5">
          <label htmlFor={nameInputId} className="block space-y-2">
            <span className="font-semibold text-slate-800 text-sm leading-none">이름</span>
            <Input
              id={nameInputId}
              defaultValue={profile.name}
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
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:gap-4">
          <Button
            type="button"
            variant="secondary"
            size="small"
            className="h-12 w-full text-sm md:h-15 md:text-base"
            onClick={onClose}
          >
            취소
          </Button>
          <Button type="button" size="small" className="h-12 w-full text-sm md:h-15 md:text-base">
            수정하기
          </Button>
        </div>
      </div>
    </div>
  );
}
