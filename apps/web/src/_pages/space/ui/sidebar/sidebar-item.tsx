import { ChevronRight } from "@moum-zip/ui/icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: ReactNode;
  href: string;
  label: string;
}

export function SidebarItem({ icon, active, label, href, ...props }: SidebarItemProps) {
  const className = cn(
    "flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-foreground text-sm",
    "transition-colors hover:bg-primary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    active && "bg-primary/20 text-primary",
  );

  const left = (
    <span className="flex min-w-0 items-center gap-2">
      {icon ? <span className="\ shrink-0 text-foreground [&>svg]:size-4">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </span>
  );

  const right = (
    <span className="flex shrink-0 items-center justify-end gap-2 text-foreground [&>svg]:size-4">
      <ChevronRight />
    </span>
  );

  return (
    <Link href={href} className={className} {...props}>
      {left}
      {right}
    </Link>
  );
}
