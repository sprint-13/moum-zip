"use client";

import { Pencil } from "@ui/icons";
import { useState } from "react";
import type { MypageProfile } from "@/_pages/mypage/model/types";
import { ProfileEditModal } from "@/_pages/mypage/ui/profile-edit-modal";
import { ProfileAvatar } from "@/shared/ui";

interface ProfileSectionProps {
  profile: MypageProfile;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        className="min-h-24 rounded-3xl border px-4 py-4 shadow-sm md:min-h-[10.125rem] md:px-6 md:py-6 xl:sticky xl:top-10 xl:h-[17.75rem] xl:w-[17.625rem] xl:px-8 xl:py-10"
        style={{
          borderColor: "var(--color-green-200)",
          background: "linear-gradient(180deg, var(--color-accent) 0%, var(--color-background) 100%)",
        }}
      >
        <div className="flex items-center gap-4 md:gap-6 xl:h-full xl:flex-col xl:items-center xl:gap-0 xl:text-center">
          <ProfileAvatar
            className="size-12 shrink-0 md:size-[6.125rem] xl:size-[7.125rem]"
            src={profile.imageUrl}
            alt={`${profile.name} 프로필 이미지`}
          />

          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3 xl:h-full xl:items-center xl:text-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 font-bold text-[1.125rem] text-foreground leading-none xl:mt-6"
              aria-label="프로필 수정 모달 열기"
            >
              {profile.name}
              <Pencil size={18} className="text-muted-foreground" aria-hidden="true" />
            </button>

            <p
              className="rounded-full px-5 py-2 text-[0.875rem] text-muted-foreground leading-5 xl:mt-auto"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 65%, var(--color-background)) 100%)",
              }}
            >
              {profile.email}
            </p>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <ProfileEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
      ) : null}
    </>
  );
}
