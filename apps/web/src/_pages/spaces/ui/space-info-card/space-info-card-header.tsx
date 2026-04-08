import { Badge } from "@moum-zip/ui/components";
import type { SpaceInfo } from "@/entities/spaces";

export const SpaceInfoCardHeader = ({ space }: { space: SpaceInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-foreground text-xl leading-tight transition-colors group-hover:text-[#00bd7e]">
        {space.name}
      </h3>

      <div className="flex flex-wrap gap-2">
        <Badge variant="completedGradient" container="default" className="px-2 py-0 text-muted-foreground text-xs">
          {space.type === "project" ? "프로젝트" : "스터디"}
        </Badge>
        <Badge
          variant="completedGradient"
          className={`font-semibold text-xs ${space.status === "ongoing" ? "text-primary" : "text-muted-foreground"}`}
        >
          {space.status === "ongoing" ? "진행중" : "아카이브"}
        </Badge>
      </div>
    </div>
  );
};
