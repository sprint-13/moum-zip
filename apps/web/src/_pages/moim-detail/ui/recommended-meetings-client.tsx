"use client";

import { toast } from "@ui/components";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CompactCard } from "@/_pages/moim-detail";
import { favoriteMeetingAction } from "@/_pages/moim-detail/actions";
import LocationIcon from "@/_pages/moim-detail/assets/location.svg";
import type { RecommendedMeetingData } from "@/entities/moim-detail";
import { ROUTES } from "@/shared/config/routes";

interface Props {
  meetings: RecommendedMeetingData[];
}

export function RecommendedMeetingsClient({ meetings }: Props) {
  const [recommendedMeetings, setRecommendedMeetings] = useState(meetings);
  const [pendingLikeIds, setPendingLikeIds] = useState<number[]>([]);

  const handleToggleLike = async (meetingId: number, isLiked: boolean): Promise<boolean> => {
    if (pendingLikeIds.includes(meetingId)) {
      return false;
    }

    setPendingLikeIds((prev) => [...prev, meetingId]);

    try {
      const result = await favoriteMeetingAction(meetingId, isLiked);

      if (!result.ok) {
        toast({ message: result.message, size: "small" });
        return false;
      }

      setRecommendedMeetings((prev) =>
        prev.map((meeting) => (meeting.id === meetingId ? { ...meeting, isLiked: result.data.isLiked } : meeting)),
      );

      return true;
    } catch {
      toast({ message: "좋아요 처리 중 오류가 발생했습니다.", size: "small" });
      return false;
    } finally {
      setPendingLikeIds((prev) => prev.filter((id) => id !== meetingId));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 xl:grid-cols-4">
      {recommendedMeetings.map((meeting) => {
        const isPending = pendingLikeIds.includes(meeting.id);

        return (
          <Link
            key={meeting.id}
            href={`${ROUTES.moimDetail}/${meeting.id}`}
            className="block cursor-pointer"
            onClick={(event) => {
              const target = event.target as HTMLElement;

              if (target.closest("button")) {
                event.preventDefault();
              }
            }}
          >
            <CompactCard
              image={
                meeting.image ? (
                  <Image
                    src={meeting.image}
                    alt={meeting.title}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-xs md:text-sm">
                    이미지 영역
                  </div>
                )
              }
              deadlineLabel={meeting.deadlineLabel}
              dateLabel={meeting.dateLabel}
              timeLabel={meeting.timeLabel}
              title={meeting.title}
              locationIcon={<LocationIcon />}
              locationText={meeting.locationText}
              isLiked={meeting.isLiked}
              onLike={() => {
                if (isPending) {
                  return false;
                }

                return handleToggleLike(meeting.id, meeting.isLiked);
              }}
            />
          </Link>
        );
      })}
    </div>
  );
}
