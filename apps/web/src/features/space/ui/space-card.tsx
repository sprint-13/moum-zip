import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface SpaceCardProps {
  children: ReactNode;
  className?: string;
}

export const SpaceCard = ({ children, className }: SpaceCardProps) => {
  return (
    <section
      className={cn("rounded-lg border border-primary/20 bg-background p-5 text-foreground shadow-sm", className)}
    >
      {children}
    </section>
  );
};
