"use client";
import * as Shadcn from "@ui/components/shadcn/dropdown-menu";
import { cn } from "@ui/lib/utils";
import type * as React from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

type DropdownItemProps = React.ComponentPropsWithoutRef<typeof Shadcn.DropdownMenuItem>;

const DropdownBase = ({ trigger, children, contentClassName }: DropdownProps) => {
  return (
    <Shadcn.DropdownMenu>
      <Shadcn.DropdownMenuTrigger asChild>{trigger}</Shadcn.DropdownMenuTrigger>
      <Shadcn.DropdownMenuContent className={cn("min-w-27.5 space-y-2 shadow-xl rounded-xl", contentClassName)}>
        {children}
      </Shadcn.DropdownMenuContent>
    </Shadcn.DropdownMenu>
  );
};

const DropdownItem = ({ children, className, ...props }: DropdownItemProps) => {
  return (
    <Shadcn.DropdownMenuItem className={cn("rounded-lg py-1.5 text-sm font-medium", className)} {...props}>
      {children}
    </Shadcn.DropdownMenuItem>
  );
};

export const Dropdown = Object.assign(DropdownBase, {
  Item: DropdownItem,
});
