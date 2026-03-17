"use client";
import * as Shadcn from "@ui/components/shadcn/navigation-menu";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const gnbLinkVariants = cva(
  "inline-flex items-center gap-1 p-3 font-medium text-gray-500 transition-colors hover:cursor-pointer hover:bg-transparent hover:text-primary focus:bg-transparent focus-visible:ring-1",
  {
    variants: {
      variant: {
        default: "text-md",
        sm: "text-sm",
      },
      selected: {
        true: "text-primary",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      selected: false,
    },
  },
);

type GnbRootProps = ComponentProps<typeof Shadcn.NavigationMenu>;

const GnbRoot = ({ children, className, ...props }: GnbRootProps) => {
  return (
    <Shadcn.NavigationMenu className={cn("mx-auto w-full max-w-6xl justify-between", className)} {...props}>
      {children}
    </Shadcn.NavigationMenu>
  );
};

type GnbListProps = ComponentProps<typeof Shadcn.NavigationMenuList>;

const GnbList = ({ children, className, ...props }: GnbListProps) => {
  return (
    <Shadcn.NavigationMenuList className={cn("gap-2", className)} {...props}>
      {children}
    </Shadcn.NavigationMenuList>
  );
};

type GnbItemProps = ComponentProps<typeof Shadcn.NavigationMenuItem>;

const GnbItem = ({ children, ...props }: GnbItemProps) => {
  return <Shadcn.NavigationMenuItem {...props}>{children}</Shadcn.NavigationMenuItem>;
};

type GnbLinkProps = Omit<ComponentProps<typeof Shadcn.NavigationMenuLink>, "className"> &
  VariantProps<typeof gnbLinkVariants>;

const GnbLink = ({ children, variant = "default", selected, ...props }: GnbLinkProps) => {
  return (
    <Shadcn.NavigationMenuLink className={cn(gnbLinkVariants({ variant, selected }))} {...props}>
      {children}
    </Shadcn.NavigationMenuLink>
  );
};

export const Gnb = Object.assign(GnbRoot, {
  Item: GnbItem,
  Content: Shadcn.NavigationMenuContent,
  Trigger: Shadcn.NavigationMenuTrigger,
  List: GnbList,
  Link: GnbLink,
});
