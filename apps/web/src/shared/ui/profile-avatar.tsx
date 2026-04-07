"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import { ProfileIcon } from "@/shared/ui/profile-icon";

interface ProfileAvatarProps {
  className?: string;
  iconClassName?: string;
  src?: string;
  alt?: string;
}

export const ProfileAvatar = ({ className, iconClassName, src, alt = "프로필 이미지" }: ProfileAvatarProps) => {
  if (src) {
    return (
      <div
        className={cn(
          "relative flex aspect-square size-12 items-center justify-center rounded-full border bg-card",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="rounded-full object-cover"
          sizes="(min-width: 80rem) 7.125rem, 7rem"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex aspect-square size-12 items-center justify-center rounded-full bg-card", className)}
      role="img"
      aria-label={alt}
    >
      <ProfileIcon className={cn("h-full w-full", iconClassName)} aria-hidden="true" />
    </div>
  );
};
