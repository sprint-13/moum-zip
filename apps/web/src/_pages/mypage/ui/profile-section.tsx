"use client";

import { Pencil } from "@ui/icons";
import { useState } from "react";
import type { ProfileMockData } from "../mock-data";
import ProfileAvatar from "./profile-avatar";
import ProfileEditModal from "./profile-edit-modal";

interface ProfileSectionProps {
  profile: ProfileMockData;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="rounded-3xl border border-[#99F1D1] bg-[linear-gradient(180deg,#E9FBF1_0%,#E9FCFC_100%)] px-8 py-10 shadow-sm xl:sticky xl:top-10 xl:h-[17.75rem] xl:w-[17.625rem]">
        <div className="flex h-full flex-col items-center text-center">
          <ProfileAvatar
            className="size-28 xl:size-[7.125rem]"
            src={profile.imageUrl}
            alt={`${profile.name} 프로필 이미지`}
          />

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 font-bold text-[1.125rem] text-foreground leading-none"
            aria-label="프로필 수정 모달 열기"
          >
            {profile.name}
            <Pencil size={18} className="text-muted-foreground" aria-hidden="true" />
          </button>

          <p className="mt-auto rounded-full bg-[linear-gradient(180deg,#DEF8EA_0%,#D9F6F4_100%)] px-5 py-2 text-[0.875rem] text-muted-foreground leading-5">
            {profile.email}
          </p>
        </div>
      </section>

      <ProfileEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={profile} />
    </>
  );
}
