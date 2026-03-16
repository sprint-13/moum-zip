import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold rounded-xl transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-green-600 disabled:bg-slate-100 disabled:text-slate-600",
        secondary: "border border-primary text-primary bg-white hover:bg-primary/10",
        tertiary: "bg-slate-200 text-slate-600",
      },
      size: {
        small: "h-10 px-4 text-sm whitespace-nowrap",
        medium: "h-12 px-5 text-base",
        large: "h-[60px] px-6 text-xl",
      },
      width: {
        full: "w-full",
        fit: "w-fit",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      width: "fit",
    },
  },
);
