import { Button } from "@ui/components";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

interface SpaceCardJoinButtonProps extends Omit<ComponentProps<typeof Button>, "asChild" | "icon" | "onClick"> {}

export const SpaceCardJoinButton = ({ children, className, disabled, ...props }: SpaceCardJoinButtonProps) => {
  return (
    <Button
      {...props}
      asChild
      className={cn(
        className,
        disabled && "cursor-not-allowed bg-slate-100 text-slate-600 opacity-60 hover:bg-slate-100",
      )}
    >
      <span>{children}</span>
    </Button>
  );
};
