"use client";
import * as Shadcn from "@ui/components/shadcn/select";
import { cn } from "@ui/lib/utils";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

type SelectBoxProps = React.ComponentProps<typeof Shadcn.Select>;

interface SelectBoxTriggerProps extends React.ComponentProps<typeof Shadcn.SelectTrigger> {
  placeholder?: string;
  icon?: React.ReactNode;
}
type SelectBoxItemProps = React.ComponentProps<typeof Shadcn.SelectItem>;
type SelectBoxContentProps = React.ComponentProps<typeof Shadcn.SelectContent>;

const SelectBoxBase = ({ children, ...props }: SelectBoxProps) => {
  return <Shadcn.Select {...props}>{children}</Shadcn.Select>;
};

const SelectBoxTrigger = ({ placeholder, icon, className, ...props }: SelectBoxTriggerProps) => {
  return (
    <Shadcn.SelectTrigger
      className={cn("group min-h-11 py-2 text-base rounded-xl sm:min-h-12 sm:p-3 [&>svg]:hidden", className)}
      {...props}
    >
      <Shadcn.SelectValue placeholder={placeholder} />
      <span className="inline-flex items-center justify-center transition-transform group-data-[state=open]:rotate-180">
        {icon ?? <ChevronDown />}
      </span>
    </Shadcn.SelectTrigger>
  );
};

const SelectBoxContent = ({ children, className, ...props }: SelectBoxContentProps) => {
  return (
    <Shadcn.SelectContent
      position="popper"
      sideOffset={4}
      className={cn("space-y-2 rounded-xl shadow-xl", className)}
      {...props}
    >
      <Shadcn.SelectGroup>{children}</Shadcn.SelectGroup>
    </Shadcn.SelectContent>
  );
};

const SelectBoxItem = ({ children, className, ...props }: SelectBoxItemProps) => {
  return (
    <Shadcn.SelectItem
      className={cn("rounded-lg py-2 sm:py-2.5 pl-2 sm:pl-3 text-sm sm:text-base font-medium", className)}
      {...props}
    >
      {children}
    </Shadcn.SelectItem>
  );
};

export const SelectBox = Object.assign(SelectBoxBase, {
  Trigger: SelectBoxTrigger,
  Content: SelectBoxContent,
  Item: SelectBoxItem,
});
