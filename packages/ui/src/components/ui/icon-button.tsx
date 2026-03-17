import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonVariant = "send" | "edit" | "delete";
export type IconButtonSize = "icon-sm" | "icon-md" | "icon-lg";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-colors disabled:pointer-events-none",
  {
    variants: {
      variant: {
        send: "border border-slate-200 bg-white",
        edit: "border border-slate-200 bg-white text-gray-600",
        delete: "bg-black/80 text-white",
      },
      size: {
        "icon-sm": "h-[18px] w-[18px]",
        "icon-md": "h-10 w-10",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "send",
      size: "icon-md",
    },
  },
);

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // 👈 React. 제거
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon?: ReactNode;
}

export function IconButton({ variant = "send", size = "icon-md", className, icon, ...props }: IconButtonProps) {
  return (
    <button type="button" className={cn(iconButtonVariants({ variant, size }), className)} {...props}>
      {icon}
    </button>
  );
}
