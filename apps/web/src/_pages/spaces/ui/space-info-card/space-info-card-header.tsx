import { Badge } from "@moum-zip/ui/components";
import { MoreVertical } from "@moum-zip/ui/icons";
import type { SpaceInfo } from "@/entities/space";

export const SpaceInfoCardHeader = ({ space }: { space: SpaceInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-foreground text-xl leading-tight transition-colors group-hover:text-[#00bd7e]">
        {space.name}
      </h3>

      <div className="flex flex-wrap gap-2">
        <Badge variant="completedGradient" container="default" className="px-2 py-0 text-muted-foreground">
          {space.category}
        </Badge>
        <Badge
          variant="completedGradient"
          className={`font-semibold ${space.status === "ongoing" ? "text-primary" : "text-muted-foreground"}`}
        >
          {space.status === "ongoing" ? "진행중" : "아카이브"}
        </Badge>
        <button type="button" className="p-1 text-slate-300 transition-colors hover:text-slate-600">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
