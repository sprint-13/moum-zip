import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";

// types
export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "primary" | "secondary" | "tertiary";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

// variants
const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold rounded-xl transition-colors disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-green-600 disabled:bg-slate-100 disabled:text-slate-600",
        secondary: "border border-primary text-primary bg-white hover:bg-primary/10",
        tertiary: "bg-slate-200 text-slate-600 hover:bg-slate-300",
      },
      size: {
        small: "h-10 min-w-[83px] px-4 text-sm whitespace-nowrap",
        medium: "h-12 min-w-[311px] px-5 text-base",
        large: "h-[60px] min-w-[474px] px-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

// component
export function Button({ variant = "primary", size = "medium", className, icon, children, ...props }: ButtonProps) {
  return (
    <button type="button" className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
