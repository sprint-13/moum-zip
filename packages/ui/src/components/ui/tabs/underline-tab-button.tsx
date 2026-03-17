"use client";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const underlineTabButtonVariants = cva(
  [
    "relative inline-flex w-fit items-center justify-center",
    "text-center font-semibold leading-none transition-colors",
    'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:transition-colors after:content-[""]',
  ].join(" "),
  {
    variants: {
      variant: {
        default: "text-neutral-500 after:bg-neutral-200 hover:text-neutral-600 hover:after:bg-neutral-300",
        active: "text-primary after:bg-primary",
      },
      size: {
        small: "px-8 py-2 text-sm",
        large: "px-10 py-4 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "small",
    },
  },
);

interface UnderlineTabButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof underlineTabButtonVariants> {}

export const UnderlineTabButton = ({
  variant,
  size,
  className,
  children,
  type = "button",
  ...props
}: UnderlineTabButtonProps) => {
  return (
    <button
      type={type}
      role="tab"
      aria-selected={variant === "active"}
      className={cn(underlineTabButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
