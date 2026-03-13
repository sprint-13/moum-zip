import { cn } from "../../lib/utils";
import * as Shadcn from "../shadcn/sheet";

const SheetRoot = (props: React.ComponentProps<typeof Shadcn.Sheet>) => <Shadcn.Sheet {...props} />;

const SheetTrigger = (props: React.ComponentProps<typeof Shadcn.SheetTrigger>) => <Shadcn.SheetTrigger {...props} />;

const sideMap = {
  left: "rounded-r-xl",
  right: "rounded-l-xl",
  top: "rounded-b-xl",
  bottom: "rounded-t-xl",
};

const SheetContent = ({
  className,
  side = "right",
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Shadcn.SheetContent>) => {
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

const SheetHeader = ({ children, className, ...props }: React.ComponentProps<typeof Shadcn.SheetHeader>) => (
  <Shadcn.SheetHeader className={cn(" flex-row items-center gap-2", className)} {...props}>
    {children}
  </Shadcn.SheetHeader>
);

const SheetTitle = ({ className, ...props }: React.ComponentProps<typeof Shadcn.SheetTitle>) => (
  <Shadcn.SheetTitle className={cn("text-base font-semibold text-foreground", className)} {...props} />
);

const SheetList = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn("flex flex-1 flex-col overflow-y-auto gap-1 no-scrollbar", className)} {...props} />
);

const SheetItem = ({ className, children, ...props }: React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  );
};

const SheetFooter = ({ children, className, ...props }: React.ComponentProps<typeof Shadcn.SheetFooter>) => (
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
