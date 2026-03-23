"use client";
import * as Shadcn from "@ui/components/shadcn/select";
import { cn } from "@ui/lib/utils";
import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type SelectBoxProps = ComponentProps<typeof Shadcn.Select>;

const SelectBoxBase = ({ children, ...props }: SelectBoxProps) => <Shadcn.Select {...props}>{children}</Shadcn.Select>;

interface SelectBoxTriggerProps extends ComponentProps<typeof Shadcn.SelectTrigger> {
  placeholder?: string;
  icon?: ReactNode;
}

const SelectBoxTrigger = ({ placeholder, icon, className, ...props }: SelectBoxTriggerProps) => (
  <Shadcn.SelectTrigger
    className={cn("group min-h-11 w-full rounded-xl py-2 text-base sm:min-h-12 sm:p-3 [&>svg]:hidden", className)}
    {...props}
  >
    <Shadcn.SelectValue placeholder={placeholder} />
    <span className="inline-flex items-center justify-center transition-transform group-data-[state=open]:rotate-180">
      {icon ?? <ChevronDown />}
    </span>
  </Shadcn.SelectTrigger>
);

type SelectBoxContentProps = ComponentProps<typeof Shadcn.SelectContent>;

const SelectBoxContent = ({ children, className, ...props }: SelectBoxContentProps) => (
  <Shadcn.SelectContent
    position="popper"
    sideOffset={4}
    className={cn("space-y-2 rounded-xl shadow-xl", className)}
    {...props}
  >
    <Shadcn.SelectGroup>{children}</Shadcn.SelectGroup>
  </Shadcn.SelectContent>
);

type SelectBoxItemProps = ComponentProps<typeof Shadcn.SelectItem>;

const SelectBoxItem = ({ children, className, ...props }: SelectBoxItemProps) => (
  <Shadcn.SelectItem
    className={cn("rounded-lg py-2 pl-2 font-medium text-sm sm:py-2.5 sm:pl-3 sm:text-base", className)}
    {...props}
  >
    {children}
  </Shadcn.SelectItem>
);

export const SelectBox = Object.assign(SelectBoxBase, {
  Trigger: SelectBoxTrigger,
  Content: SelectBoxContent,
  Item: SelectBoxItem,
});
