import { Button } from "@moum-zip/ui/components";
import { Pencil, UserRoundPlus } from "@moum-zip/ui/icons";

export const SpaceHeader = () => {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div>
        <h1 className="font-bold text-2xl" aria-label="space-top-bar-title">
          Study Group Management
        </h1>
        <p className="text-gray-500 text-sm">we learn react and javascript</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="tertiary" size="small" icon={<Pencil className="size-4" />} className="gap-2">
          Write Post
        </Button>
        <Button variant="tertiary" size="small" icon={<UserRoundPlus className="size-4" />} className="gap-2">
          Invite Member
        </Button>
      </div>
    </div>
  );
};
