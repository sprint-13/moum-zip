import { Calendar, ChevronRight, MapPin, Users } from "@moum-zip/ui/icons";
import type { SpaceInfo } from "@/entities/space/model/types";
import { SpaceInfoCardHeader } from "./space-info-card/space-info-card-header";
import { SpaceInfoCardLabel } from "./space-info-card/space-info-card-label";
import { SpaceInfoCardThumbnail } from "./space-info-card/space-info-card-thumbnail";

interface SpaceInfoCardProps {
  space: SpaceInfo;
}

export const SpaceInfoGridCard = ({ space }: SpaceInfoCardProps) => {
  return (
    <div
      key={space.id}
      className="group mb-6 flex w-full cursor-pointer flex-col gap-6 overflow-hidden rounded-lg border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#00bd7e]/10"
    >
      <SpaceInfoCardHeader space={space} />

      {space.thumbnailUrl ? <SpaceInfoCardThumbnail thumbnailUrl={space.thumbnailUrl} name={space.name} /> : null}

      <div className="space-y-3">
        <SpaceInfoCardLabel icon={<Users className="h-3.5 w-3.5" />}>
          {space.currentParticipants}명 참여 중
        </SpaceInfoCardLabel>
        <SpaceInfoCardLabel icon={<MapPin className="h-3.5 w-3.5" />}>
          {space.location === null ? "온라인" : space.location}
        </SpaceInfoCardLabel>
      </div>

      <div className="inline-flex items-center justify-between">
        <SpaceInfoCardLabel icon={<Calendar className="h-3.5 w-3.5" />}>{space.startDate} ~</SpaceInfoCardLabel>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
          <ChevronRight className="size-5" />
        </div>
      </div>
    </div>
  );
};
