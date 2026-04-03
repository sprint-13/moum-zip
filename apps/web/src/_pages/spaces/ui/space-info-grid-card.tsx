import { Calendar, ChevronRight, MapPin, Users } from "@moum-zip/ui/icons";
import Link from "next/link";
import type { SpaceInfo } from "@/entities/spaces/model/types";
import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/date";
import { SpaceInfoCardHeader } from "./space-info-card/space-info-card-header";
import { SpaceInfoCardLabel } from "./space-info-card/space-info-card-label";
import { SpaceInfoCardThumbnail } from "./space-info-card/space-info-card-thumbnail";

interface SpaceInfoCardProps {
  space: SpaceInfo;
}

export const SpaceInfoGridCard = ({ space }: SpaceInfoCardProps) => {
  const cardContent = (
    <div
      className={cn(
        "group mb-6 flex w-full flex-col gap-6 overflow-hidden rounded-lg border border-slate-100 bg-white p-4 transition-all duration-300",
        space.isApproved
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/10"
          : "cursor-not-allowed opacity-60",
      )}
    >
      <SpaceInfoCardHeader space={space} />

      {space.image ? <SpaceInfoCardThumbnail thumbnailUrl={space.image} name={space.name} /> : null}

      <div className="space-y-3">
        <SpaceInfoCardLabel icon={<Users className="h-3.5 w-3.5" />}>{space.capacity}명 참여 중</SpaceInfoCardLabel>
        <SpaceInfoCardLabel icon={<MapPin className="h-3.5 w-3.5" />}>
          {space.location === null ? "온라인" : space.location}
        </SpaceInfoCardLabel>
      </div>

      <div className="inline-flex items-center justify-between">
        <SpaceInfoCardLabel icon={<Calendar className="h-3.5 w-3.5" />}>
          {space.startDate ? `${formatDate(space.startDate, "yyyy.MM.dd")} ~` : "일정 미정"}
        </SpaceInfoCardLabel>
        {space.isApproved ? (
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <ChevronRight className="size-5" />
          </div>
        ) : (
          <span className="font-semibold text-slate-400 text-sm">승인 대기 중</span>
        )}
      </div>
    </div>
  );

  if (!space.isApproved) {
    return <div className="w-full">{cardContent}</div>;
  }

  return (
    <Link href={`/${space.slug}`} target="_blank" rel="noopener noreferrer" className="w-full">
      {cardContent}
    </Link>
  );
};
