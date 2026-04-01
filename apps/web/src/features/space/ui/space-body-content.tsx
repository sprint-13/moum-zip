import { SquareArrowOutUpRight } from "@moum-zip/ui/icons";

interface SpaceBodyContentProps {
  title: string;
  children: React.ReactNode;
  onOpen?: () => void;
}

export const SpaceBodyContent = ({ title, children, onOpen }: SpaceBodyContentProps) => {
  return (
    <div className="rounded-lg border border-primary/20 bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-foreground text-xl">{title}</h2>
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="flex items-center gap-1 rounded-full border border-primary/20 bg-white px-2 font-medium text-foreground text-sm hover:bg-primary/10"
          >
            바로가기
            <SquareArrowOutUpRight className="size-3" />
          </button>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
};
