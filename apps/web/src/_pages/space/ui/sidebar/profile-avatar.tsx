"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/cn";

interface ProfileAvatarProps {
  className?: string;
  imageUrl?: string;
  name: string;
  textClassName?: string;
}

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "?";
};

export const ProfileAvatar = ({ className, imageUrl, name, textClassName }: ProfileAvatarProps) => {
  const isLocalImageUrl = imageUrl?.startsWith("blob:");

  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-background",
        className,
      )}
    >
      {imageUrl ? (
        <Image
          alt={`${name} 프로필 이미지`}
          className="object-cover"
          fill
          sizes="64px"
          src={imageUrl}
          unoptimized={isLocalImageUrl}
        />
      ) : (
        <span className={cn("font-semibold text-sm", textClassName)}>{getInitials(name)}</span>
      )}
    </div>
  );
};
