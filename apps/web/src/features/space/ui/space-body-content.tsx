import { SquareArrowOutUpRight } from "@moum-zip/ui/icons";

interface SpaceBodyContentProps {
  title: string;
  children: React.ReactNode;
  onOpen?: () => void;
}

export const SpaceBodyContent = ({ title, children, onOpen }: SpaceBodyContentProps) => {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-foreground text-xl">{title}</h2>
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 text-foreground text-sm hover:bg-slate-200"
          >
            Open
            <SquareArrowOutUpRight className="size-3" />
          </button>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
};
