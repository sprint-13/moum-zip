"use client";

import { ProfileIcon } from "@ui/icons/profile-icon";
import { cn } from "@ui/lib/utils";
import Image from "next/image";

interface ProfileAvatarProps {
  className?: string;
  iconClassName?: string;
  src?: string;
  alt?: string;
}

export default function ProfileAvatar({ className, iconClassName, src, alt = "프로필 이미지" }: ProfileAvatarProps) {
  return (
    <div
      className={cn("relative flex aspect-square items-center justify-center rounded-full border bg-card", className)}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="rounded-full object-cover"
          sizes="(min-width: 80rem) 7.125rem, 7rem"
        />
      ) : (
        <ProfileIcon className={cn("h-full w-full", iconClassName)} />
      )}
    </div>
  );
}
