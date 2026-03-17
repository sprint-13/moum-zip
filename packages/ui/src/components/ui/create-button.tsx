import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { Plus } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const createButtonVariants = cva(
  "flex items-center justify-center bg-primary text-white transition-colors hover:bg-green-600",
  {
    variants: {
      variant: {
        full: "h-16 min-w-[188px] gap-2 rounded-[24px] px-6 font-bold text-xl",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "full",
    },
  },
);

// ButtonHTMLAttributes 확장
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "full" | "icon";
  children?: ReactNode;
}

export function CreateButton({ variant = "full", children, className, ...props }: Props) {
  return (
    <button type="button" className={cn(createButtonVariants({ variant }), className)} {...props}>
      <Plus size={32} aria-hidden="true" />
      {children}
    </button>
  );
}
