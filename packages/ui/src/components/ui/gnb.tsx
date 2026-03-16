import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import * as Shadcn from "../shadcn/navigation-menu";

const gnbLinkVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors hover:cursor-pointer hover:text-primary text-gray-500 hover:bg-transparent p-3 focus:bg-transparent focus-visible:ring-1",
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

const GnbRoot = ({ children, className, ...props }: React.ComponentProps<typeof Shadcn.NavigationMenu>) => {
  return (
    <Shadcn.NavigationMenu className={cn("w-full mx-auto max-w-6xl justify-between", className)} {...props}>
      {children}
    </Shadcn.NavigationMenu>
  );
};

const GnbList = ({ children, className, ...props }: React.ComponentProps<typeof Shadcn.NavigationMenuList>) => {
  return (
    <Shadcn.NavigationMenuList className={cn("gap-2", className)} {...props}>
      {children}
    </Shadcn.NavigationMenuList>
  );
};

const GnbItem = ({ children, ...props }: React.ComponentProps<typeof Shadcn.NavigationMenuItem>) => {
  return <Shadcn.NavigationMenuItem {...props}>{children}</Shadcn.NavigationMenuItem>;
};

interface GnbLinkProps
  extends Omit<React.ComponentProps<typeof Shadcn.NavigationMenuLink>, "className">,
    VariantProps<typeof gnbLinkVariants> {}

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
