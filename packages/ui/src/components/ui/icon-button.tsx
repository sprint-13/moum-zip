import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";

export type IconButtonVariant = "send" | "edit" | "delete";
export type IconButtonSize = "icon-sm" | "icon-md" | "icon-lg";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors disabled:pointer-events-none rounded-full",
  {
    variants: {
      variant: {
        send: "bg-white border border-slate-200",
        edit: "bg-white border border-slate-200 text-gray-600",
        delete: "bg-black/80 text-white",
      },
      size: {
        "icon-sm": "w-[18px] h-[18px]",
        "icon-md": "w-10 h-10",
        "icon-lg": "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "send",
      size: "icon-md",
    },
  },
);

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon?: React.ReactNode;
}

export function IconButton({ variant = "send", size = "icon-md", className, icon, ...props }: IconButtonProps) {
  return (
    <button type="button" className={cn(iconButtonVariants({ variant, size }), className)} {...props}>
      {icon}
    </button>
  );
}
