"use client";
import * as Shadcn from "@ui/components/shadcn/sheet";
import { cn } from "@ui/lib/utils";
import type { ComponentProps, HTMLAttributes } from "react";

type SheetRootProps = ComponentProps<typeof Shadcn.Sheet>;

const SheetRoot = (props: SheetRootProps) => <Shadcn.Sheet {...props} />;

type SheetTriggerProps = ComponentProps<typeof Shadcn.SheetTrigger>;

const SheetTrigger = (props: SheetTriggerProps) => <Shadcn.SheetTrigger {...props} />;

const sideMap = {
  left: "rounded-r-xl",
  right: "rounded-l-xl",
  top: "rounded-b-xl",
  bottom: "rounded-t-xl",
};

type SheetContentProps = ComponentProps<typeof Shadcn.SheetContent>;

const SheetContent = ({ className, side = "right", showCloseButton = false, ...props }: SheetContentProps) => {
  const rounded = sideMap[side];
  return (
    <Shadcn.SheetContent
      className={cn("flex flex-col gap-0 py-4", rounded, className)}
      showCloseButton={showCloseButton}
      side={side}
      {...props}
    />
  );
};

type SheetHeaderProps = ComponentProps<typeof Shadcn.SheetHeader>;

const SheetHeader = ({ children, className, ...props }: SheetHeaderProps) => (
  <Shadcn.SheetHeader className={cn("flex-row items-center gap-2", className)} {...props}>
    {children}
  </Shadcn.SheetHeader>
);

type SheetTitleProps = ComponentProps<typeof Shadcn.SheetTitle>;

const SheetTitle = ({ className, ...props }: SheetTitleProps) => (
  <Shadcn.SheetTitle className={cn("font-semibold text-base text-foreground", className)} {...props} />
);

type SheetListProps = HTMLAttributes<HTMLUListElement>;

const SheetList = ({ className, ...props }: SheetListProps) => (
  <ul className={cn("no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto", className)} {...props} />
);

type SheetItemProps = HTMLAttributes<HTMLLIElement>;

const SheetItem = ({ className, children, ...props }: SheetItemProps) => (
  <li className={className} {...props}>
    {children}
  </li>
);

type SheetFooterProps = ComponentProps<typeof Shadcn.SheetFooter>;

const SheetFooter = ({ children, className, ...props }: SheetFooterProps) => (
  <Shadcn.SheetFooter className={cn("p-4", className)} {...props}>
    {children}
  </Shadcn.SheetFooter>
);

export const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Close: Shadcn.SheetClose,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  List: SheetList,
  Item: SheetItem,
  Footer: SheetFooter,
});
