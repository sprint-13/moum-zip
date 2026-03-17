"use client";
import * as Shadcn from "@ui/components/shadcn/dropdown-menu";
import { cn } from "@ui/lib/utils";
import type { ComponentProps } from "react";

type DropdownProps = ComponentProps<typeof Shadcn.DropdownMenu>;

const DropdownBase = ({ children, ...props }: DropdownProps) => {
  return <Shadcn.DropdownMenu {...props}>{children}</Shadcn.DropdownMenu>;
};

interface DropdownTriggerProps extends Omit<ComponentProps<typeof Shadcn.DropdownMenuTrigger>, "children"> {
  children: React.ReactElement;
}

const DropdownTrigger = ({ children, ...props }: DropdownTriggerProps) => {
  return (
    <Shadcn.DropdownMenuTrigger asChild {...props}>
      {children}
    </Shadcn.DropdownMenuTrigger>
  );
};

type DropdownContentProps = React.ComponentProps<typeof Shadcn.DropdownMenuContent>;

const DropdownContent = ({ children, className, ...props }: DropdownContentProps) => {
  return (
    <Shadcn.DropdownMenuContent className={cn("min-w-[110px] space-y-2 rounded-xl shadow-xl", className)} {...props}>
      {children}
    </Shadcn.DropdownMenuContent>
  );
};

type DropdownItemProps = React.ComponentProps<typeof Shadcn.DropdownMenuItem>;

const DropdownItem = ({ children, className, ...props }: DropdownItemProps) => {
  return (
    <Shadcn.DropdownMenuItem
      className={cn("rounded-lg py-1 font-medium text-sm sm:py-1.5 sm:text-base", className)}
      {...props}
    >
      {children}
    </Shadcn.DropdownMenuItem>
  );
};

export const Dropdown = Object.assign(DropdownBase, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
});
