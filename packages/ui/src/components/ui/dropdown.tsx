"use client";
import * as Shadcn from "@ui/components/shadcn/dropdown-menu";
import { cn } from "@ui/lib/utils";
import type * as React from "react";

type DropdownProps = React.ComponentProps<typeof Shadcn.DropdownMenu>;
type DropdownTriggerProps = React.ComponentProps<typeof Shadcn.DropdownMenuTrigger>;
type DropdownContentProps = React.ComponentProps<typeof Shadcn.DropdownMenuContent>;
type DropdownItemProps = React.ComponentProps<typeof Shadcn.DropdownMenuItem>;

const DropdownBase = ({ children, ...props }: DropdownProps) => {
  return <Shadcn.DropdownMenu {...props}>{children}</Shadcn.DropdownMenu>;
};

const DropdownTrigger = ({ children, ...props }: DropdownTriggerProps) => {
  return (
    <Shadcn.DropdownMenuTrigger asChild {...props}>
      {children}
    </Shadcn.DropdownMenuTrigger>
  );
};

const DropdownContent = ({ children, className, ...props }: DropdownContentProps) => {
  return (
    <Shadcn.DropdownMenuContent className={cn("min-w-[110px] space-y-2 shadow-xl rounded-xl", className)} {...props}>
      {children}
    </Shadcn.DropdownMenuContent>
  );
};

const DropdownItem = ({ children, className, ...props }: DropdownItemProps) => {
  return (
    <Shadcn.DropdownMenuItem
      className={cn("rounded-lg py-1 sm:py-1.5 text-sm sm:text-base font-medium", className)}
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
