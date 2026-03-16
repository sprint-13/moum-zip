import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const tabButtonVariants = cva(
  "inline-flex w-fit items-center justify-center rounded-[14px] px-4 py-2 leading-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-800 font-medium hover:bg-neutral-200",
        active: "bg-neutral-800 text-white font-semibold",
      },
      size: {
        small: "text-sm",
        large: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "small",
    },
  },
);

interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof tabButtonVariants> {}

export const TabButton = ({ variant, size, className, children, type = "button", ...props }: TabButtonProps) => {
  return (
    <button type={type} className={cn(tabButtonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
};
