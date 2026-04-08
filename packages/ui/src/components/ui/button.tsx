import { Button as ShadcnButton } from "@ui/components/shadcn/button";
import { cn } from "@ui/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "primary" | "secondary" | "tertiary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
  asChild?: boolean;
}

const variantMap: Record<ButtonVariant, "default" | "outline" | "secondary"> = {
  primary: "default",
  secondary: "outline",
  tertiary: "secondary",
};

const sizeClassMap: Record<ButtonSize, string> = {
  small: "h-10 min-w-[83px] whitespace-nowrap px-4 text-sm",
  medium: "h-12 min-w-[311px] px-5 text-base",
  large: "h-[60px] min-w-[474px] px-6 text-xl",
};

const variantOverrideMap: Record<ButtonVariant, string> = {
  primary:
    "rounded-xl font-semibold bg-primary text-white hover:bg-green-600 disabled:bg-slate-100 disabled:text-slate-600",
  secondary: "rounded-xl font-semibold border border-primary bg-white text-green-600 hover:bg-primary/10",
  tertiary: "rounded-xl font-semibold bg-slate-200 text-slate-600 hover:bg-slate-300",
};

export function Button({
  variant = "primary",
  size = "medium",
  className,
  icon,
  children,
  asChild,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variantMap[variant]}
      asChild={asChild}
      className={cn(sizeClassMap[size], variantOverrideMap[variant], className)}
      {...props}
    >
      {icon}
      {children}
    </ShadcnButton>
  );
}
