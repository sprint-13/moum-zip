import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { Plus } from "lucide-react";

const createButtonVariants = cva("flex items-center justify-center text-white bg-primary", {
  variants: {
    variant: {
      full: "w-[188px] h-16 rounded-[24px] gap-2 font-bold text-xl",
      icon: "w-12 h-12 rounded-full",
    },
  },
  defaultVariants: {
    variant: "full",
  },
});

interface Props {
  variant?: "full" | "icon";
  children?: React.ReactNode;
  className?: string;
}

export function CreateButton({ variant = "full", children, className }: Props) {
  return (
    <button type="button" className={cn(createButtonVariants({ variant }), className)}>
      <Plus size={32} />
      {children}
    </button>
  );
}
