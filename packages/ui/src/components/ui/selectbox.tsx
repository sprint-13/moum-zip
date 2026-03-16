"use client";
import * as Shadcn from "@ui/components/shadcn/select";
import { cn } from "@ui/lib/utils";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

interface SelectBoxProps extends React.ComponentProps<typeof Shadcn.Select> {
  placeholder?: string;
  icon?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
}

type SelectBoxItemProps = React.ComponentProps<typeof Shadcn.SelectItem>;

const SelectBoxBase = ({
  placeholder,
  children,
  icon,
  triggerClassName,
  contentClassName,
  ...props
}: SelectBoxProps) => {
  return (
    <Shadcn.Select {...props}>
      <Shadcn.SelectTrigger
        className={cn("group py-2 min-h-11 sm:p-3 sm:min-h-12 text-base rounded-xl [&>svg]:hidden", triggerClassName)}
      >
        <Shadcn.SelectValue placeholder={placeholder} />
        <span className="inline-flex items-center justify-center transition-transform group-data-[state=open]:rotate-180">
          {icon ?? <ChevronDown />}
        </span>
      </Shadcn.SelectTrigger>

      <Shadcn.SelectContent
        position="popper"
        sideOffset={4}
        className={cn("space-y-2 shadow-xl rounded-xl", contentClassName)}
      >
        <Shadcn.SelectGroup>{children}</Shadcn.SelectGroup>
      </Shadcn.SelectContent>
    </Shadcn.Select>
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
  Item: SelectBoxItem,
});
